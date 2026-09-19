import { Text } from "@mantine/core";

export const LabelForm = ({
  text,
  required = false,
}: {
  text: string;
  required?: boolean;
}) => (
  <Text size="sm" fw={500} className="text-zinc-300 mb-1.5 font-medium">
    {text} {required && <span className="text-red-500">*</span>}
  </Text>
);
