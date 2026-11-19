"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { BANNER_SECTIONS, EMOTIONS, SEARCH_CATEGORIES, SEARCH_GROUPS } from "@/data/clientAdmin";
import { useToast } from "@/components/ui/UiProvider";
import Dropdown from "@/components/ui/Dropdown";
import RichTextEditor from "./RichTextEditor";
import LinkedInImageCropper from "./LinkedInImageCropper";
import { compose, email, phone, required } from "@/lib/validators";
import http from "@/lib/http";
import { getPublicBannerSections } from "@/lib/bannerSectionApi";
import { getPublicEmotions } from "@/lib/emotionApi";
import { getPublicGroups } from "@/lib/groupApi";
import { getPublicTags, createPublicTag } from "@/lib/tagApi";
import MultiSelectTags, { type TagOption } from "@/components/ui/MultiSelectTags";
import type { ClientPost } from "@/types";

const EMPTY = {
  contactPerson: "",
  contactNo: "",
  email: "",
  address: "",
  banner: "",
  emotion: "",
  searchGroup: "",
  searchCategory: "",
  fromDate: todayISO(),
  title: "",
  image: "",
  tags: [] as string[],
  description: "",
};
type Values = typeof EMPTY;
type Errors = Partial<Record<keyof Values | "file", string>>;
interface Props {
  mode?: "client" | "admin";
  postId?: string;
  onSaved?: () => void;
}

function todayISO(): string {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

export default function AddPostForm({ mode = "client", postId, onSaved }: Props = {}) {
  const toast = useToast();
  const router = useRouter();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [fileKey, setFileKey] = useState(0);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bannerOptions, setBannerOptions] = useState<{ label: string; value: string }[]>([]);
  const [emotionOptions, setEmotionOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchGroupOptions, setSearchGroupOptions] = useState<{ label: string; value: string }[]>([]);
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string>("");
  const endpoint = mode === "admin" ? "/admin/posts" : "/client/posts";

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      getPublicBannerSections(1, 100),
      getPublicEmotions(1, 100),
      getPublicGroups(1, 100),
      getPublicTags(),
    ]).then(([bannerRes, emotionRes, groupRes, tagRes]) => {
      if (!active) return;

      if (bannerRes.status === "fulfilled" && bannerRes.value.success && Array.isArray(bannerRes.value.data)) {
        const options = bannerRes.value.data.map((item) => ({ label: item.name, value: item._id })).filter((item) => item.label);
        if (options.length > 0) {
          setBannerOptions(options);
        }
      }

      if (emotionRes.status === "fulfilled" && emotionRes.value.success && Array.isArray(emotionRes.value.data)) {
        const options = emotionRes.value.data.map((item) => ({ label: item.name, value: item._id })).filter((item) => item.label);
        if (options.length > 0) setEmotionOptions(options);
      }

      if (groupRes.status === "fulfilled" && groupRes.value.success && Array.isArray(groupRes.value.data)) {
        const options = groupRes.value.data.map((item) => ({ label: item.name, value: item._id })).filter((item) => item.label);
        if (options.length > 0) setSearchGroupOptions(options);
      }

      if (tagRes.status === "fulfilled" && tagRes.value.success && Array.isArray(tagRes.value.data)) {
        const options = tagRes.value.data
          .map((item) => ({ label: item.name, value: item._id }))
          .filter((item) => item.label);
        setTagOptions(options);
      }
    });

    return () => { active = false; };
  }, []);

  const handleCreateTag = async (tagName: string): Promise<TagOption | null> => {
    try {
      const res = await createPublicTag(tagName);
      if (res.success && res.data) {
        const newOpt: TagOption = { label: res.data.name, value: res.data._id };
        setTagOptions((prev) => {
          if (prev.some((o) => o.value === newOpt.value)) return prev;
          return [...prev, newOpt];
        });
        return newOpt;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create tag");
    }
    return null;
  };

  useEffect(() => {
    let active = true;
    const id = postId ?? new URLSearchParams(window.location.search).get("edit") ?? "";
    if (!id) return () => { active = false; };
    setEditId(id);
    setLoading(true);
    http.get<ClientPost>(`${endpoint}/${encodeURIComponent(id)}`).then(({ data }) => {
      if (active) {
        let normalizedTags: string[] = [];
        if (Array.isArray(data.tags)) {
          normalizedTags = data.tags.map((t) => (typeof t === "object" && t !== null && "_id" in t ? String(t._id) : String(t)));
        }
        setValues({
          ...EMPTY,
          ...data,
          tags: normalizedTags,
        });
      }
    }).catch((error: unknown) => {
      if (active) toast.error(error instanceof Error ? error.message : "Unable to load post");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [endpoint, postId, toast]);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleFile = (f?: File) => {
    if (!f) return;
    if (f.size > 15 * 1024 * 1024) {
      setErrors((current) => ({ ...current, file: "Image must be 15 MB or smaller" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setRawImageSrc(reader.result);
        setCropperOpen(true);
        setErrors((current) => ({ ...current, file: "" }));
      }
    };
    reader.onerror = () => toast.error("Unable to read the selected image");
    reader.readAsDataURL(f);
  };

  const handleCropApply = (processedDataUrl: string) => {
    setValues((current) => ({ ...current, image: processedDataUrl }));
    setCropperOpen(false);
    toast.success("Dimensions set & TinyAdds logo added to top-left!");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {
      contactPerson: required("Contact person name")(values.contactPerson),
      contactNo: compose(required("Contact no"), phone)(values.contactNo),
      email: compose(required("Email"), email)(values.email),
      fromDate: required("Available from date")(values.fromDate),
      title: required("Title name")(values.title),
      file: values.image ? "" : "Please choose an image",
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await http.put<ClientPost, Values>(`${endpoint}/${encodeURIComponent(editId)}`, values);
        toast.success("Post updated successfully");
        if (onSaved) onSaved();
        else router.replace("/client-admin/view-post");
      } else {
        await http.post<ClientPost, Values>(endpoint, values);
        toast.success("Post created successfully");
        if (onSaved) onSaved();
        else {
          setValues(EMPTY);
          setFileKey((key) => key + 1);
          setErrors({});
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save post");
    } finally {
      setSaving(false);
    }
  };

  const selectedBannerObj = bannerOptions.find((b) => b.value === values.banner);
  const selectedBannerName = (selectedBannerObj?.label || values.banner || "").trim().toLowerCase();
  const isListingAds = selectedBannerName === "listing ads" || values.banner === "6af6ec5ada18ee7ad2da4e33";

  const err = (key: keyof Errors) => errors[key] && <small className="lb-ca-err">{errors[key]}</small>;
  return (
    <form className="lb-ca-card" onSubmit={handleSubmit} noValidate>
      <div className="lb-ca-card-head">{editId ? "Edit Post" : "Add Post"}</div>
      <div className="lb-ca-card-body">
        {loading && <p className="text-body-secondary">Loading post...</p>}
        <div className="row g-3">
          <div className="col-md-6"><label className="lb-ca-label">Title</label><input className="form-control lb-ca-input" placeholder="Enter Title Name" value={values.title} onChange={set("title")} />{err("title")}</div>
          <div className="col-md-6"><label className="lb-ca-label">Person Name</label><input className="form-control lb-ca-input" placeholder="Enter Name" value={values.contactPerson} onChange={set("contactPerson")} />{err("contactPerson")}</div>
          <div className="col-md-6"><label className="lb-ca-label">Contact No</label><input type="tel" className="form-control lb-ca-input" placeholder="Enter Number" value={values.contactNo} onChange={set("contactNo")} />{err("contactNo")}</div>
          <div className="col-md-6"><label className="lb-ca-label">Email ID</label><input type="email" className="form-control lb-ca-input" placeholder="Enter Email" value={values.email} onChange={set("email")} />{err("email")}</div>
          {/* <div className="col-md-6"><label className="lb-ca-label">Address</label><textarea rows={1} className="form-control lb-ca-input" placeholder="Enter Address" value={values.address} onChange={set("address")} /></div> */}
          <div className="col-md-6">
            <label className="lb-ca-label">Banner Section</label>
            <Dropdown
              ariaLabel="Banner Section"
              value={values.banner}
              onChange={(v) =>
                setValues((x) => {
                  const bObj = bannerOptions.find((b) => b.value === v);
                  const bName = (bObj?.label || v || "").trim().toLowerCase();
                  const isListing = bName === "listing ads" || v === "6af6ec5ada18ee7ad2da4e33";
                  return {
                    ...x,
                    banner: v,
                    emotion: isListing ? x.emotion : "",
                    searchGroup: isListing ? x.searchGroup : "",
                  };
                })
              }
              options={bannerOptions}
              placeholder="-- Select Banner Section --"
              allowEmpty
            />
          </div>
          <div className="col-md-6"><label className="lb-ca-label">Available From Date</label><input type="date" className="form-control lb-ca-input" value={values.fromDate || Date.now()} onChange={set("fromDate")} />{err("fromDate")}</div>
          <div className="col-md-6"><label className="lb-ca-label">Emotion</label><Dropdown ariaLabel="Emotion" value={values.emotion} onChange={(v) => setValues((x) => ({ ...x, emotion: v }))} options={emotionOptions} placeholder="-- Select Emotion --" allowEmpty disabled={!isListingAds} /></div>
          <div className="col-md-6"><label className="lb-ca-label">Search Group</label><Dropdown ariaLabel="Search Group" value={values.searchGroup} onChange={(v) => setValues((x) => ({ ...x, searchGroup: v }))} options={searchGroupOptions} placeholder="-- Select Search Group --" allowEmpty disabled={!isListingAds} /></div>
          {/* <div className="col-md-6"><label className="lb-ca-label">Search Category</label><Dropdown ariaLabel="Search Category" value={values.searchCategory} onChange={(v) => setValues((x) => ({ ...x, searchCategory: v }))} options={SEARCH_CATEGORIES} placeholder="-- Select Search Category --" allowEmpty /></div> */}
          <div className="col-md-6">
            <label className="lb-ca-label">Choose file</label>
            <input
              key={fileKey}
              type="file"
              accept="image/*"
              className="form-control lb-ca-input"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {err("file")}
          </div>
          <div className="col-md-6">
            <div
              className="lb-ca-upload position-relative"
              style={{ cursor: values.image ? "pointer" : "default" }}
              onClick={() => {
                if (values.image) {
                  setRawImageSrc(rawImageSrc || values.image);
                  setCropperOpen(true);
                }
              }}
              title={values.image ? "Click image to adjust dimensions" : undefined}
            >
              {values.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={values.image} alt="Post preview" />
              ) : (
                <span><i className="bi bi-cloud-arrow-up"></i>UPLOAD IMG</span>
              )}
            </div>
          </div>
          <div className="col-12">
            <label className="lb-ca-label">Tags</label>
            <MultiSelectTags
              value={values.tags}
              onChange={(selected) => setValues((v) => ({ ...v, tags: selected }))}
              options={tagOptions}
              onCreateTag={handleCreateTag}
              placeholder="Search or select tags, or type to create new..."
            />
          </div>
          <div className="col-12"><label className="lb-ca-label">Description</label><RichTextEditor value={values.description} onChange={(html) => setValues((v) => ({ ...v, description: html }))} /></div>
        </div>
        <div className="text-end mt-4"><button type="submit" className="btn lb-btn-primary" disabled={saving || loading}>{saving ? "Saving..." : editId ? "Update Post" : "Add Post"}</button></div>
      </div>

      {/* LinkedIn-Style Image Dimension & Cropper Modal */}
      <LinkedInImageCropper
        isOpen={cropperOpen}
        imageSrc={rawImageSrc}
        bannerContext={values.banner}
        onApply={handleCropApply}
        onCancel={() => setCropperOpen(false)}
      />
    </form>
  );
}
