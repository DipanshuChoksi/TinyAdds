"use client";

import { Editor } from "@tinymce/tinymce-react";

import "tinymce/tinymce";
import "tinymce/models/dom/model";

import "tinymce/themes/silver";
import "tinymce/icons/default";

import "tinymce/skins/ui/oxide/skin.js";
import "tinymce/skins/content/default/content.js";
import "tinymce/skins/ui/oxide/content.js";

// Plugins
import "tinymce/plugins/anchor";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/charmap";
import "tinymce/plugins/code";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/preview";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/table";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/help";
import "tinymce/plugins/help/js/i18n/keynav/en";

export default function BundledEditor(props: any) {
  return (
    <Editor
      licenseKey="gpl"
      {...props}
    />
  );
}