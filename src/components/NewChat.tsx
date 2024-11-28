import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button, CloseButton, Container } from "@mantine/core";

export default function NewChat() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer.Root
        opened={opened}
        size={"75%"}
        style={{ width: "100%" }}
        position="bottom"
        onClose={close}
      >
        <Drawer.Overlay />

        <Drawer.Content style={{ width: "", margin: "" }}>
          <div className="px-2 py-2 w-full relative">
            <p className="text-center font-semibold text-4xl">New Chat</p>
            <Drawer.CloseButton
              style={{ position: "absolute", top: 0, right: 0 }}
              m={10}
            />
          </div>
          <Drawer.Body>Drawer content</Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Button onClick={open}>Open drawer</Button>
    </>
  );
}
