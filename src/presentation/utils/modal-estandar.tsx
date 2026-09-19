import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Title,
  type ModalProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertCircle } from "@tabler/icons-react";
import { cn } from "../../shared/functions/cn";

interface ModalEstandarProps extends Partial<ModalProps> {
  opened: boolean;
  close: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  rightSection?: React.ReactNode;
  validateClose?: boolean;
  closeConfirmationTitle?: string;
  closeConfirmationMessage?: React.ReactNode;
  stylesBody?: string;
}

export const ModalEstandar = ({
  opened,
  close,
  title,
  children,
  size,
  zIndex,
  rightSection,
  validateClose = false,
  closeConfirmationTitle,
  closeConfirmationMessage,
  stylesBody,
  ...props
}: ModalEstandarProps) => {
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);

  const handleClose = () => {
    if (validateClose) {
      openConfirm();
      return;
    }
    close();
  };

  const handleConfirmClose = () => {
    closeConfirm();
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        size={size || "md"}
        zIndex={zIndex}
        title={
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-6 bg-linear-to-b from-[#ffc933] to-[#b8920a]
                  rounded-full shadow-[0_0_10px_#d4a50a]"
              />
              <span
                className="text-xl font-bold bg-linear-to-r from-white via-zinc-100
                  to-zinc-400 bg-clip-text text-transparent tracking-tight leading-normal"
              >
                {title}
              </span>
            </div>
            {rightSection && (
              <div className="flex items-center flex-none mr-4">
                {rightSection}
              </div>
            )}
          </div>
        }
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="xl"
        classNames={{
          content: "bg-zinc-950 border border-white/10 shadow-2xl shadow-black",
          header:
            "bg-zinc-950 text-white pt-5 pb-4 px-6 border-b border-white/10",
          body: cn(`bg-zinc-950 px-6 pt-3 pb-6`, stylesBody),
          close: `text-zinc-400 hover:text-white hover:bg-white/10 transition-all
            duration-200 rounded-full w-8 h-8 flex items-center justify-center`,
          title: "text-xl font-bold text-white flex-1",
        }}
        transitionProps={{ transition: "pop", duration: 250 }}
        {...props}
      >
        <div className="">{children}</div>
      </Modal>

      <Modal
        opened={confirmOpened}
        onClose={closeConfirm}
        size="sm"
        zIndex={typeof zIndex === "number" ? zIndex + 1 : undefined}
        centered
        withCloseButton={false}
        title=""
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        radius="lg"
        classNames={{
          content:
            "bg-zinc-900 border border-yellow-500/30 shadow-2xl shadow-black",
          header: "!p-0 !min-h-0 !border-0 !bg-transparent",
          body: "px-6 pt-6 pb-6",
        }}
        transitionProps={{ transition: "pop", duration: 200 }}
      >
        <Stack align="center" gap="md">
          <ThemeIcon
            size={48}
            radius={100}
            variant="gradient"
            gradient={{ from: "red.6", to: "orange.6" }}
          >
            <IconAlertCircle size={28} stroke={1.5} />
          </ThemeIcon>

          <Title order={3} className="text-white text-center">
            {closeConfirmationTitle ?? "¿Cerrar sin guardar?"}
          </Title>

          <Text c="zinc.4" ta="center" size="sm">
            {closeConfirmationMessage ?? (
              <>
                ¿Estás seguro de cerrar? Los cambios no guardados se perderán y
                el proceso en curso quedará descartado.
              </>
            )}
          </Text>

          <Group gap="sm" mt="sm" justify="center" w="100%">
            <Button
              variant="default"
              size="xs"
              radius="lg"
              onClick={closeConfirm}
              data-autofocus
              className="bg-zinc-800! text-zinc-300! border-zinc-700!"
            >
              Cancelar
            </Button>
            <Button
              color="red"
              size="xs"
              radius="lg"
              onClick={handleConfirmClose}
            >
              Sí, cerrar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
