import { resendClient, sender } from "@/lib/resend";
import { createWelcomeEmailTemplate } from "./emailTemplates";
import { AppError } from "@/utils/app-error";

export const sendWelcomeEmail = async (
  email: string,
  name: string,
  clientURL: string
) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: [email],
    subject: "Welcome to Chatify",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.log(error);
    throw new AppError("Failed to send welcome email", 500);
  }
};
