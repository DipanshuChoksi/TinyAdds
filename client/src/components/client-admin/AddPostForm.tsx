"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BANNER_SECTIONS, EMOTIONS, SEARCH_CATEGORIES, SEARCH_GROUPS } from "@/data/clientAdmin";
import { useToast } from "@/components/ui/UiProvider";
import Dropdown from "@/components/ui/Dropdown";
import RichTextEditor from "./RichTextEditor";
import { compose, email, phone, required } from "@/lib/validators";
import http from "@/lib/http";
import type { ClientPost } from "@/types";

const EMPTY = { contactPerson: "", contactNo: "", email: "", address: "", banner: "", emotion: "", searchGroup: "", searchCategory: "", fromDate: "", title: "", image: "", tag: "", description: "" };
type Values = typeof EMPTY;
type Errors = Partial<Record<keyof Values | "file", string>>;

export default function AddPostForm() {
  const toast = useToast();
  const router = useRouter();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [fileKey, setFileKey] = useState(0);
  const [editId, setEditId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const id = new URLSearchParams(window.location.search).get("edit");
    if (!id) return () => { active = false; };
    setEditId(id);
    setLoading(true);
    http.get<ClientPost>(`/client/posts/${encodeURIComponent(id)}`).then(({ data }) => {
      if (active) setValues({ ...EMPTY, ...data });
    }).catch((error: unknown) => {
      if (active) toast.error(error instanceof Error ? error.message : "Unable to load post");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [toast]);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleFile = (f?: File) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setErrors((current) => ({ ...current, file: "Image must be 5 MB or smaller" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setValues((current) => ({ ...current, image: reader.result as string }));
        setErrors((current) => ({ ...current, file: "" }));
      }
    };
    reader.onerror = () => toast.error("Unable to read the selected image");
    reader.readAsDataURL(f);
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
        await http.put<ClientPost, Values>(`/client/posts/${encodeURIComponent(editId)}`, values);
        toast.success("Post updated successfully");
        router.replace("/client-admin/view-post");
      } else {
        await http.post<ClientPost, Values>("/client/posts", values);
        toast.success("Post created successfully");
        setValues(EMPTY);
        setFileKey((key) => key + 1);
        setErrors({});
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save post");
    } finally {
      setSaving(false);
    }
  };

  const err = (key: keyof Errors) => errors[key] && <small className="lb-ca-err">{errors[key]}</small>;
  return (
    <form className="lb-ca-card" onSubmit={handleSubmit} noValidate>
      <div className="lb-ca-card-head">{editId ? "Edit Post" : "Add Post"}</div>
      <div className="lb-ca-card-body">
        {loading && <p className="text-body-secondary">Loading post...</p>}
        <div className="row g-3">
          <div className="col-md-6"><label className="lb-ca-label">Contact Person Name</label><input className="form-control lb-ca-input" placeholder="Enter Name" value={values.contactPerson} onChange={set("contactPerson")} />{err("contactPerson")}</div>
          <div className="col-md-6"><label className="lb-ca-label">Contact No</label><input type="tel" className="form-control lb-ca-input" placeholder="Enter Number" value={values.contactNo} onChange={set("contactNo")} />{err("contactNo")}</div>
          <div className="col-md-6"><label className="lb-ca-label">Email ID</label><input type="email" className="form-control lb-ca-input" placeholder="Enter Email" value={values.email} onChange={set("email")} />{err("email")}</div>
          <div className="col-md-6"><label className="lb-ca-label">Address</label><textarea rows={1} className="form-control lb-ca-input" placeholder="Enter Address" value={values.address} onChange={set("address")} /></div>
          <div className="col-md-6"><label className="lb-ca-label">Banner Section</label><Dropdown ariaLabel="Banner Section" value={values.banner} onChange={(v) => setValues((x) => ({ ...x, banner: v }))} options={BANNER_SECTIONS} placeholder="-- Select Banner Section --" allowEmpty /></div>
          <div className="col-md-6"><label className="lb-ca-label">Emotion</label><Dropdown ariaLabel="Emotion" value={values.emotion} onChange={(v) => setValues((x) => ({ ...x, emotion: v }))} options={EMOTIONS} placeholder="-- Select Emotion --" allowEmpty /></div>
          <div className="col-md-6"><label className="lb-ca-label">Search Group</label><Dropdown ariaLabel="Search Group" value={values.searchGroup} onChange={(v) => setValues((x) => ({ ...x, searchGroup: v }))} options={SEARCH_GROUPS} placeholder="-- Select Search Group --" allowEmpty /></div>
          <div className="col-md-6"><label className="lb-ca-label">Search Category</label><Dropdown ariaLabel="Search Category" value={values.searchCategory} onChange={(v) => setValues((x) => ({ ...x, searchCategory: v }))} options={SEARCH_CATEGORIES} placeholder="-- Select Search Category --" allowEmpty /></div>
          <div className="col-md-6"><label className="lb-ca-label">Available From Date</label><input type="date" className="form-control lb-ca-input" value={values.fromDate} onChange={set("fromDate")} />{err("fromDate")}</div>
          <div className="col-md-6"><label className="lb-ca-label">Title Name</label><input className="form-control lb-ca-input" placeholder="Enter Title Name" value={values.title} onChange={set("title")} />{err("title")}</div>
          <div className="col-md-6">
            <label className="lb-ca-label">Choose file</label>
            <input key={fileKey} type="file" accept="image/*" className="form-control lb-ca-input" onChange={(e) => handleFile(e.target.files?.[0])} />
            {err("file")}
          </div>
          <div className="col-md-6">
            <div className="lb-ca-upload">
              {values.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={values.image} alt="Post preview" />
              ) : (
                <span><i className="bi bi-cloud-arrow-up"></i>UPLOAD IMG</span>
              )}
            </div>
          </div>
          <div className="col-12"><label className="lb-ca-label">Tag</label><input className="form-control lb-ca-input" placeholder="e.g. auction, finance" value={values.tag} onChange={set("tag")} /></div>
          <div className="col-12"><label className="lb-ca-label">Description</label><RichTextEditor value={values.description} onChange={(html) => setValues((v) => ({ ...v, description: html }))} /></div>
        </div>
        <div className="text-end mt-4"><button type="submit" className="btn lb-btn-primary" disabled={saving || loading}>{saving ? "Saving..." : editId ? "Update Post" : "Add Post"}</button></div>
      </div>
    </form>
  );
}
