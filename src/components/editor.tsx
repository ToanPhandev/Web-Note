import {
  BlockNoteEditor,
  PartialBlock,
} from "@blocknote/core";
import {
  BlockNoteViewRaw as BlockNoteView,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { useMutation, useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

interface EditorProps {
  onChange?: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

export const Editor = ({
  onChange,
  initialContent,
  editable,
}: EditorProps) => {
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleUpload = async (file: File) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();

    const url = await convex.query(api.files.getUrl, { storageId });

    if (!url) {
      throw new Error("Upload failed");
    }

    return url;
  };

  const editor: BlockNoteEditor = useBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange: (editor: any) => {
      if (onChange) {
        onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
      }
    },
    uploadFile: handleUpload,
  } as any);

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={"light"}
    />
  );
};
