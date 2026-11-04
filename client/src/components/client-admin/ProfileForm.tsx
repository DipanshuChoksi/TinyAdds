"use client";

import { useEffect, useState } from "react";
import { LOCATION_TREE } from "@/data/clientAdmin";
import { useToast } from "@/components/ui/UiProvider";
import Dropdown from "@/components/ui/Dropdown";
import { compose, email, phone, required } from "@/lib/validators";
import http from "@/lib/http";

type Values = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  country: string;
  state: string;
  city: string;
  profileImage: string;
};

const EMPTY: Values = { firstName: "", lastName: "", mobile: "", email: "", country: "", state: "", city: "", profileImage: "" };

export default function ProfileForm() {
  const toast = useToast();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    http.get<Values>("/auth/me").then(({ data }) => {
      if (active) setValues(data);
    }).catch((error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Unable to load profile");
    });
    return () => { active = false; };
  }, [toast]);

  const set = (key: keyof Values, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const states = Object.keys(LOCATION_TREE[values.country] ?? {});
  const cities = LOCATION_TREE[values.country]?.[values.state] ?? [];

  const changeCountry = (country: string) => {
    const state = Object.keys(LOCATION_TREE[country] ?? {})[0] ?? "";
    setValues((v) => ({ ...v, country, state, city: LOCATION_TREE[country]?.[state]?.[0] ?? "" }));
  };
  const changeState = (state: string) => setValues((v) => ({ ...v, state, city: LOCATION_TREE[v.country]?.[state]?.[0] ?? "" }));

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") set("profileImage", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = {
      firstName: required("First name")(values.firstName),
      mobile: compose(required("Mobile no"), phone)(values.mobile),
      email: compose(required("Email"), email)(values.email),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSaving(true);
    try {
      const { data } = await http.patch<Values, Values>("/auth/profile", values);
      setValues(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const err = (key: keyof Values) => errors[key] && <small className="lb-ca-err">{errors[key]}</small>;

  return (
    <form className="lb-ca-card" onSubmit={handleSubmit} noValidate>
      <div className="lb-ca-cover">
        {values.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={values.profileImage} alt="Profile" className="lb-ca-avatar" />
        ) : (
          <span className="lb-ca-avatar"><i className="bi bi-person-fill"></i></span>
        )}
      </div>
      <div className="lb-ca-card-body">
        <table className="lb-ca-form-table">
          <tbody>
            <tr><th>First Name :</th><td><input className="form-control lb-ca-input" value={values.firstName} onChange={(e) => set("firstName", e.target.value)} />{err("firstName")}</td></tr>
            <tr><th>Last Name :</th><td><input className="form-control lb-ca-input" value={values.lastName} onChange={(e) => set("lastName", e.target.value)} /></td></tr>
            <tr><th>Mobile No :</th><td><input className="form-control lb-ca-input" value={values.mobile} onChange={(e) => set("mobile", e.target.value)} />{err("mobile")}</td></tr>
            <tr><th>Email ID :</th><td><input type="email" className="form-control lb-ca-input" value={values.email} onChange={(e) => set("email", e.target.value)} />{err("email")}</td></tr>
            <tr><th>Country :</th><td><Dropdown ariaLabel="Country" value={values.country} onChange={changeCountry} options={Object.keys(LOCATION_TREE)} /></td></tr>
            <tr><th>State :</th><td><Dropdown ariaLabel="State" value={values.state} onChange={changeState} options={states} /></td></tr>
            <tr><th>City :</th><td><Dropdown ariaLabel="City" value={values.city} onChange={(v) => set("city", v)} options={cities} /></td></tr>
            <tr><th>Profile Image :</th><td><input type="file" accept="image/*" className="form-control lb-ca-input" onChange={(e) => handleFile(e.target.files?.[0])} /></td></tr>
          </tbody>
        </table>
        <div className="text-end mt-3"><button type="submit" className="btn lb-btn-primary" disabled={saving}>{saving ? "Saving..." : "Submit"}</button></div>
      </div>
    </form>
  );
}
