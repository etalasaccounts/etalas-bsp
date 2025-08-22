import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface InvitationEmailProps {
  invitedByEmail: string
  invitedByName: string
  teamName: string
  inviteLink: string
}

export const InvitationEmail = ({
  invitedByEmail,
  invitedByName,
  teamName,
  inviteLink,
}: InvitationEmailProps) => {
  const previewText = `Bergabung dengan ${teamName} di WhatsAppin Aja`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Text style={logo}>WhatsAppin Aja</Text>
          </Section>
          <Text style={paragraph}>Halo,</Text>
          <Text style={paragraph}>
            <strong>{invitedByName}</strong> ({invitedByEmail}) telah mengundang Anda untuk
            bergabung dengan tim <strong>{teamName}</strong> di WhatsAppin Aja.
          </Text>
          <Text style={paragraph}>
            WhatsAppin Aja adalah platform untuk mengelola percakapan WhatsApp Business 
            dengan tim Anda secara efisien.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={inviteLink}>
              Terima Undangan
            </Button>
          </Section>
          <Text style={paragraph}>
            atau salin dan tempel URL ini ke browser Anda:{" "}
            <Link href={inviteLink} style={link}>
              {inviteLink}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Undangan ini akan kadaluarsa dalam 7 hari. Jika Anda tidak berharap menerima 
            undangan ini, Anda dapat mengabaikan email ini.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const logoContainer = {
  marginTop: "32px",
}

const logo = {
  margin: "0 auto",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
}

const btnContainer = {
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#22c55e",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "16px auto",
}

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
}

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "20px",
}

const link = {
  color: "#22c55e",
  textDecoration: "underline",
}
