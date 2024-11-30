"use client";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";
import { Plus } from "lucide-react";
import { OurUploadDropzone } from "./Dropzone";
export default function UploadDocuments() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer.Root
        opened={opened}
        position="bottom"
        size={"70%"}
        onClose={close}
      >
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Upload Documents</Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <OurUploadDropzone />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Button onClick={open} size="md">
        <div className="flex flex-row gap-1 items-center">
          <Plus size={25} />
          <span>Upload</span>
        </div>
      </Button>
    </>
  );
}
