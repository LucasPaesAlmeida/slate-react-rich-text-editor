import { Transforms } from "slate";

import imageExtensions from "image-extensions";
import isUrl from "is-url"

const withImages = editor => {
  const { insertData, isVoid } = editor;

  const insertImage = url => {
    Transforms.insertNodes(editor,
      {type: 'image', url, description: ""}
    )
  }

  const isImageUrl = url => {
    if(!url) return false;
    if(!isUrl(url)) return false;
    const ext = new URL(url).pathname.split(".").pop();
    return imageExtensions.includes(ext);
  }

  editor.isVoid = element => {
    return element.type === "image" ? true : isVoid(element);
  }

  editor.insertData = data => {
    const text = data.getData("text/plain");
    const { files } = data;

    if(files && files.lenght > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");
        
        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(url);
          })

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(text);
    } else {
      insertData(data);
    }
  }

  return editor;
}

export default withImages;