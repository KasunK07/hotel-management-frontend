import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Card,
  Grid,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowRight,
  IconBuilding,
  IconId,
  IconLock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../layouts/auth-layout/AuthLayout";
import {
  businessRegistrationSchema,
  type BusinessRegistrationValues,
} from "../schemas/auth-schemas";
import { registerBusiness } from "../api/auth-api";
import { errorMessage } from "../../shared/api/http";

export function BusinessRegistrationPage() {
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BusinessRegistrationValues>({
    resolver: zodResolver(businessRegistrationSchema),
    defaultValues: {
      businessName: "",
      registrationNumber: "",
      businessEmail: "",
      businessPhone: "",
      address: "",
      city: "",
      postalCode: "",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      password: "",
    },
  });
  const password = useWatch({ control, name: "password" });
  const submit = handleSubmit(
    async (values) => {
      setShowError(false);
      setServerError("");
      try {
        const result = await registerBusiness(values);
        navigate("/verify-email", {
          state: {
            email: result.verification_email,
            businessName: values.businessName,
            verificationUrl: result.verification_url,
          },
        });
      } catch (error) {
        setServerError(errorMessage(error));
      }
    },
    () => setShowError(true),
  );
  return (
    <AuthLayout activeStep={1}>
      <Stack gap="xs" mb="xl">
        <Text size="sm" fw={700} c="ember.7">
          CREATE YOUR BUSINESS ACCOUNT
        </Text>
        <Title order={1} fz={{ base: 28, sm: 36 }} lts="-.035em">
          Register your business
        </Title>
        <Text c="dimmed">
          Start with the legal business details and primary owner information.
        </Text>
      </Stack>
      {showError && (
        <Alert
          icon={<IconAlertCircle size={18} />}
          color="red"
          mb="lg"
          title="A few details need your attention"
        >
          Review the highlighted fields, then try again.
        </Alert>
      )}
      {serverError && <Alert color="red" mb="lg" title="Registration failed">{serverError}</Alert>}
      <form onSubmit={submit} noValidate>
        <Stack gap="xl">
          <FormSection
            icon={<IconBuilding size={19} />}
            title="Business details"
            description="Use the information shown on your official registration."
          >
            <Grid>
              <Grid.Col span={{ base: 12, sm: 7 }}>
                <TextInput
                  label="Registered Business Name"
                  placeholder="e.g. Meridian Dining Group (Pvt) Ltd"
                  required
                  leftSection={<IconBuilding size={16} />}
                  {...register("businessName")}
                  error={errors.businessName?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 5 }}>
                <TextInput
                  label="Registration Number"
                  placeholder="e.g. PV 123456"
                  required
                  leftSection={<IconId size={16} />}
                  {...register("registrationNumber")}
                  error={errors.registrationNumber?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Business Email"
                  placeholder="hello@business.com"
                  type="email"
                  required
                  leftSection={<IconMail size={16} />}
                  {...register("businessEmail")}
                  error={errors.businessEmail?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Business Phone"
                  placeholder="+94 11 234 5678"
                  required
                  leftSection={<IconPhone size={16} />}
                  {...register("businessPhone")}
                  error={errors.businessPhone?.message}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Registered Address"
                  placeholder="Street address"
                  required
                  minRows={2}
                  {...register("address")}
                  error={errors.address?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 7 }}>
                <TextInput
                  label="City"
                  required
                  leftSection={<IconMapPin size={16} />}
                  {...register("city")}
                  error={errors.city?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 5 }}>
                <TextInput
                  label="Postal Code"
                  required
                  {...register("postalCode")}
                  error={errors.postalCode?.message}
                />
              </Grid.Col>
            </Grid>
          </FormSection>
          <FormSection
            icon={<IconUser size={19} />}
            title="Business owner"
            description="We’ll send the verification link to the owner email, or the business email when left blank."
          >
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Owner’s Full Name"
                  placeholder="Full legal name"
                  required
                  leftSection={<IconUser size={16} />}
                  {...register("ownerName")}
                  error={errors.ownerName?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Owner’s Email"
                  description="Optional — uses Business Email if blank"
                  placeholder="owner@email.com"
                  type="email"
                  leftSection={<IconMail size={16} />}
                  {...register("ownerEmail")}
                  error={errors.ownerEmail?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Owner’s Phone"
                  description="Optional — uses Business Email if blank"
                  placeholder="+94 77 123 4567"
                  leftSection={<IconPhone size={16} />}
                  {...register("ownerPhone")}
                  error={errors.ownerPhone?.message}
                />
              </Grid.Col>
            </Grid>
          </FormSection>
          <FormSection
            icon={<IconLock size={19} />}
            title="Account security"
            description="Create a temporary password. You’ll set your final password after email verification."
          >
            <PasswordInput
              label="Password"
              placeholder="At least 8 characters"
              required
              leftSection={<IconLock size={16} />}
              {...register("password")}
              error={errors.password?.message}
            />
            <Group gap="lg" mt="xs">
              {[
                [password.length >= 8, "8+ characters"],
                [/[A-Z]/.test(password), "Uppercase letter"],
                [/[0-9]/.test(password), "One number"],
              ].map(([valid, label]) => (
                <Group key={String(label)} gap={6}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 7,
                      background: valid ? "#348f5d" : "#c9cbc7",
                    }}
                  />
                  <Text size="xs" c={valid ? "forest.7" : "dimmed"}>
                    {String(label)}
                  </Text>
                </Group>
              ))}
            </Group>
          </FormSection>
          <Group justify="space-between" align="center" wrap="wrap">
            <Text size="xs" c="dimmed" maw={390}>
              By continuing, you confirm that you’re authorized to register this
              business and agree to Meridian’s terms.
            </Text>
            <Button
              type="submit"
              size="md"
              loading={isSubmitting}
              rightSection={<IconArrowRight size={17} />}
            >
              Continue to verification
            </Button>
          </Group>
        </Stack>
      </form>
    </AuthLayout>
  );
}

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card withBorder p={{ base: "lg", sm: "xl" }}>
      <Group align="flex-start" mb="xl" wrap="nowrap">
        <ThemeIcon color="ember" variant="light" size={40} radius="md">
          {icon}
        </ThemeIcon>
        <Stack gap={2}>
          <Title order={2} fz="lg">
            {title}
          </Title>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
      </Group>
      {children}
    </Card>
  );
}
