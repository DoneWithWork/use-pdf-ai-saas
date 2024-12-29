import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface NetlifyWelcomeEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: links[];
}
type links = {
  link: string;
  title: string;
};
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const PropDefaults: NetlifyWelcomeEmailProps = {
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Upload your first document</strong> <br />
          <Link href={`${baseUrl}/dashboard/documents`}>
            Head over to your documents page{" "}
          </Link>
          and upload your first PDF file to get started
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Have a chat</strong>
          <br />
          Create your first{" "}
          <Link href={`${baseUrl}/dashboard/workspaces`}>Workspace</Link> and
          start asking any questions about your PDFs
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Need more juice?</strong>
          <br />
          Want to do more with your PDFs? Consider{" "}
          <Link
            href={`${baseUrl}/pricing`}
            className=" font-bold text-blue-500 underline hover:cursor-pointer"
          >
            Upgrading
          </Link>
          . Our plans start as low as <strong>$5/month</strong>
        </li>
      ),
    },
  ],
  links: [
    {
      link: `${baseUrl}/use-cases`,
      title: "Use Cases",
    },
    {
      link: `${baseUrl}/pricing`,
      title: "Pricing",
    },
    {
      link: `${baseUrl}/legal`,
      title: "Legal",
    },
  ],
};

export const WelcomeEmail = ({
  steps = PropDefaults.steps,
  links = PropDefaults.links,
}: NetlifyWelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>USE PDF AI Welcome</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          {/* <Img
            src={`${process.env.VERCEL_ENV === "production" ? `${baseUrl}/logo.png` : "/static/logo.png"}`}
            width="250"
            height="75"
            alt="USE PDF AI"
            className="mx-auto my-20 aspect-video"
          /> */}
          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">
              Welcome to USE PDF AI
            </Heading>

            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations! You&apos;ve successfully signed up for USE
                  PDF AI. We&apos;re excited to have you on board.
                </Text>

                <Text className="text-base">
                  Here&apos;s how to get started:
                </Text>
              </Row>
            </Section>

            <ul>{steps?.map(({ Description }) => Description)}</ul>

            <Section className="text-center mt-10">
              <Link
                className="bg-brand text-white rounded-lg py-3 px-[18px] "
                href={`${baseUrl}/dashboard`}
              >
                Go to your dashboard
              </Link>
            </Section>

            <Section className="mt-45">
              <Row>
                {links?.map((link, index) => (
                  <Column key={index}>
                    <Link
                      className="text-black underline font-bold"
                      href={link.link}
                    >
                      {link.title}
                    </Link>
                    <span className="text-green-500">→</span>
                  </Column>
                ))}
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
