"use client";
import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";
import { Plus } from "lucide-react";
import { OurUploadDropzone } from "./Dropzone";
import { Button } from "./ui/button";
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
            <Drawer.Title style={{ fontWeight: "600" }}>
              Upload Documents
            </Drawer.Title>
            <Drawer.CloseButton />
          </Drawer.Header>
          <Drawer.Body>
            <OurUploadDropzone close={close} />
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>

      <Button onClick={open}>
        <div className="flex flex-row gap-1 items-center">
          <Plus size={25} />
          <span>Upload</span>
        </div>
      </Button>
    </>
  );
}
