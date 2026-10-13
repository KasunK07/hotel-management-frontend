import { useState } from "react";
import { Alert, Button, Card, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AuthLayout } from "../../../layouts/auth-layout/AuthLayout";
import { login, saveSession } from "../api/auth-api";
import { errorMessage } from "../../shared/api/http";

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      saveSession(await login(email, password));
      queryClient.clear();
      navigate("/dashboard", { replace: true });
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setLoading(false);
    }
  }

  return <AuthLayout activeStep={3}>
    <Card withBorder p={{ base: "xl", sm: 44 }} maw={500} mx="auto" mt={{ base: 20, sm: 70 }}>
      <Stack gap="lg">
        <Title order={1}>Sign in</Title>
        <Text c="dimmed">Access your restaurant dashboard.</Text>
        {error && <Alert color="red">{error}</Alert>}
        <form onSubmit={submit}>
          <Stack>
            <TextInput label="Owner email" type="email" required value={email} onChange={(event) => setEmail(event.currentTarget.value)} />
            <PasswordInput label="Password" required value={password} onChange={(event) => setPassword(event.currentTarget.value)} />
            <Button type="submit" loading={loading}>Sign in</Button>
          </Stack>
        </form>
        <Text size="sm">New here? <Link to="/register">Register your business</Link></Text>
      </Stack>
    </Card>
  </AuthLayout>;
}
