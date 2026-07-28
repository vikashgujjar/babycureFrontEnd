import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http, unwrap } from "@/lib/api/client";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResendOtpInput,
  ResetPasswordInput,
  UpdateProfileInput,
  VerifyOtpInput,
} from "@/lib/validation";
import type { ApiEnvelope, Customer } from "@/lib/types";
import { clearSessionToken, getSessionToken, setSessionToken } from "@/lib/auth/session";

/** Both register and login now only kick off an OTP send — no session yet. */
interface OtpRequiredResponse {
  email: string;
  requires_otp?: boolean;
  requires_verification?: boolean;
}

/**
 * registration/login purposes complete the session here (token + customer);
 * password_reset returns a short-lived reset_token instead, since the flow
 * still needs a new password from the client on a separate step.
 */
interface VerifyOtpResponse {
  token?: string;
  customer?: Customer;
  reset_token?: string;
}

export const authKeys = {
  me: ["auth", "me"] as const,
};

/** Only fetches when a session cookie exists — logged-out visitors never
 * hit /customer/me. */
export function useCurrentCustomer() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => unwrap(http.get<ApiEnvelope<Customer>>("/customer/me")),
    enabled: Boolean(getSessionToken()),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      unwrap(http.post<ApiEnvelope<OtpRequiredResponse>>("/customer/register", input)),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) =>
      unwrap(http.post<ApiEnvelope<OtpRequiredResponse>>("/customer/login", input)),
  });
}

/** Shared by all three OTP flows — `purpose` decides what the response contains. */
export function useVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VerifyOtpInput) =>
      unwrap(http.post<ApiEnvelope<VerifyOtpResponse>>("/customer/verify-otp", input)),
    onSuccess: (data) => {
      if (data.token && data.customer) {
        setSessionToken(data.token);
        queryClient.setQueryData(authKeys.me, data.customer);
      }
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (input: ResendOtpInput) => unwrap(http.post("/customer/resend-otp", input)),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => unwrap(http.post("/customer/logout")),
    onSettled: () => {
      clearSessionToken();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) =>
      unwrap(http.post<ApiEnvelope<{ email: string }>>("/customer/forgot-password", input)),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) =>
      unwrap(http.post("/customer/reset-password", input)),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      unwrap(http.post("/customer/change-password", input)),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      unwrap(http.put<ApiEnvelope<Customer>>("/customer/profile", input)),
    onSuccess: (customer) => {
      queryClient.setQueryData(authKeys.me, customer);
    },
  });
}
