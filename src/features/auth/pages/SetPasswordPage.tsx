import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Alert,
  Card,
  Group,
  PasswordInput,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowRight, IconCheck, IconLock } from "@tabler/icons-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "../../../layouts/auth-layout/AuthLayout";
import { useQueryClient } from "@tanstack/react-query";
import { saveSession, setPassword, verifyEmail } from "../api/auth-api";
import { errorMessage } from "../../shared/api/http";
import {
  passwordSetupSchema,
  type PasswordSetupValues,
} from "../schemas/auth-schemas";

export function SetPasswordPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const email = (location.state as { email?: string } | null)?.email ?? "your verified email";
  const [verificationState, setVerificationState] = useState<"checking" | "verified" | "invalid">(token ? "checking" : "invalid");
  const [serverError, setServerError] = useState("");
  useEffect(() => {
    if (!token) {
      return;
    }
    verifyEmail(token)
      .then(() => setVerificationState("verified"))
      .catch((error) => {
        setServerError(errorMessage(error));
        setVerificationState("invalid");
      });
  }, [token]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PasswordSetupValues>({
    resolver: zodResolver(passwordSetupSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" });
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length * 25;
  const submit = handleSubmit(async (values) => {
    setServerError("");
    try {
      const session = await setPassword(token, values.password);
      saveSession(session);
      queryClient.clear();
      notifications.show({ title: "Welcome to Meridian", message: "Your account is ready.", color: "forest" });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setServerError(errorMessage(error));
    }
  });
  return (
    <AuthLayout activeStep={3}>
      <Card
        withBorder
        p={{ base: "xl", sm: 44 }}
        maw={570}
        mx="auto"
        mt={{ base: 20, sm: 70 }}
      >
          <Stack gap="xl">
          {verificationState === "checking" && <Alert color="blue">Checking your verification link…</Alert>}
          {verificationState === "invalid" && <Alert color="red" title="Link unavailable">{serverError || "Open the verification link from your email."}</Alert>}
          <ThemeIcon size={58} radius="xl" color="ember" variant="light">
            <IconLock size={27} />
          </ThemeIcon>
          <Stack gap="xs">
            <Text size="sm" fw={750} c="ember.7">
              EMAIL VERIFIED
            </Text>
            <Title order={1} fz={{ base: 28, sm: 34 }}>
              Secure your account
            </Title>
            <Text c="dimmed" lh={1.6}>
              Choose the password you’ll use to sign in as{" "}
              <Text span fw={700} c="dark">
                {email}
              </Text>
              .
            </Text>
          </Stack>
          {verificationState === "verified" && <form onSubmit={submit}>
            <Stack gap="lg">
              <PasswordInput
                label="New Password"
                placeholder="Enter a strong password"
                required
                leftSection={<IconLock size={16} />}
                {...register("password")}
                error={errors.password?.message}
              />
              <Stack gap={7}>
                <Group justify="space-between">
                  <Text size="xs" fw={650}>
                    Password strength
                  </Text>
                  <Text size="xs" c="dimmed">
                    {strength < 50
                      ? "Weak"
                      : strength < 100
                        ? "Good"
                        : "Strong"}
                  </Text>
                </Group>
                <Progress
                  value={strength}
                  color={
                    strength < 50 ? "red" : strength < 100 ? "orange" : "forest"
                  }
                  size={7}
                  radius="xl"
                />
                <Group gap="lg">
                  {[
                    [checks[0], "8+ characters"],
                    [checks[1], "Uppercase"],
                    [checks[2], "Number"],
                    [checks[3], "Symbol"],
                  ].map(([valid, label]) => (
                    <Group key={String(label)} gap={5}>
                      <IconCheck
                        size={13}
                        color={valid ? "#348f5d" : "#b8bbb7"}
                      />
                      <Text size="xs" c={valid ? "forest.7" : "dimmed"}>
                        {String(label)}
                      </Text>
                    </Group>
                  ))}
                </Group>
              </Stack>
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                required
                leftSection={<IconLock size={16} />}
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
              <Button
                type="submit"
                size="md"
                loading={isSubmitting}
                rightSection={<IconArrowRight size={17} />}
              >
                Save password and open dashboard
              </Button>
            </Stack>
          </form>}
          {verificationState === "verified" && serverError && <Alert color="red">{serverError}</Alert>}
          <Text size="xs" c="dimmed" ta="center">
            Your password is encrypted and never visible to Meridian staff.
          </Text>
        </Stack>
      </Card>
    </AuthLayout>
  );
}
