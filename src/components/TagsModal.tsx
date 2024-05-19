import Link from "next/link";
import { Check, ExternalLink, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  cn,
} from "@nextui-org/react";
import axiosInstance from "@/lib/axios";
import { Tags } from "@prisma/client";
import { useRouter } from "next/navigation";
import { set } from "date-fns";

const TagsModal = () => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tags, setTags] = useState<string[]>([]);
  useEffect(() => {
    getTags().then((data) => setTags(data));
  }, []);

  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const handleCheckboxChange = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((prevTag) => prevTag !== tag)
        : [...prevTags, tag]
    );
  };
  return (
    <>
      <button onClick={onOpen}>
        <ExternalLink size={18} onClick={onOpen} />
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        disableAnimation
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Thể loại
              </ModalHeader>
              <ModalBody className="flex flex-row flex-wrap gap-5">
                {tags.map((tag: string) => (
                  <Checkbox
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleCheckboxChange(tag)}
                    classNames={{
                      base: cn(
                        "hover:bg-content2 items-center justify-start",
                        "cursor-pointer rounded-lg p-2 border-2 border-transparent",
                        "data-[selected=true]:border-red-300"
                      ),
                      label: "w-full",
                    }}
                    color="danger"
                  >
                    {tag.toUpperCase()}
                  </Checkbox>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={(e) => {
                    setSelectedTags([]);
                    onClose();
                  }}
                >
                  Đóng
                </Button>

                <Button
                  color="primary"
                  onPress={(e) => {
                    onClose();
                    if (selectedTags.length === 0) return;
                    router.push(`/search/tags?q=${selectedTags.join("&q=")}`);
                    setSelectedTags([]);
                  }}
                >
                  Lọc
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export { TagsModal };

export async function getServerSideProps() {
  const { data } = await axiosInstance.get("/api/tags");
  return { props: { tags: data.data } };
}

async function getTags() {
  const { data } = await axiosInstance.get("/api/tags");
  return data.data;
}
