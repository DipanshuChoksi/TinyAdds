"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/UiProvider";
import Dropdown from "@/components/ui/Dropdown";
import { compose, email, phone, required } from "@/lib/validators";
import http from "@/lib/http";
import { useUserStore } from "@/store/userStore";
import { getPublicCountries } from "@/lib/countryApi";
import { getPublicStates } from "@/lib/stateApi";
import { getPublicCities } from "@/lib/cityApi";
import type { PublicCountryResponse } from "@/types/country";
import type { PublicStateResponse } from "@/types/state";
import type { PublicCityResponse } from "@/types/city";

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

interface UserProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  countryId?: string;
  stateId?: string;
  cityId?: string;
  profileImage: string;
  isAdmin?: boolean;
}

const EMPTY: Values = { firstName: "", lastName: "", mobile: "", email: "", country: "", state: "", city: "", profileImage: "" };

export default function ProfileForm() {
  const toast = useToast();
  const user = useUserStore((s) => s.user);
  const initialized = useUserStore((s) => s.initialized);
  const loading = useUserStore((s) => s.loading);
  const fetchUser = useUserStore((s) => s.fetchUser);
  const setUser = useUserStore((s) => s.setUser);

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [saving, setSaving] = useState(false);

  // Dynamic Master Location State
  const [countryList, setCountryList] = useState<PublicCountryResponse[]>([]);
  const [stateList, setStateList] = useState<PublicStateResponse[]>([]);
  const [cityList, setCityList] = useState<PublicCityResponse[]>([]);

  // Fetch all countries on component mount
  useEffect(() => {
    let active = true;
    getPublicCountries(1, 200)
      .then((res) => {
        if (active && res.success && Array.isArray(res.data)) {
          setCountryList(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch countries:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  // Fetch states when selected country changes
  useEffect(() => {
    if (!values.country) {
      setStateList([]);
      return;
    }
    const matchedCountry = countryList.find(
      (c) => c._id === values.country || String(c.id) === values.country || c.name.trim().toLowerCase() === values.country.trim().toLowerCase()
    );
    if (!matchedCountry) return;

    let active = true;
    getPublicStates(matchedCountry.id, 1, 200)
      .then((res) => {
        if (active && res.success && Array.isArray(res.data)) {
          setStateList(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch states:", err);
      });

    return () => {
      active = false;
    };
  }, [values.country, countryList]);

  // Fetch cities when selected state changes
  useEffect(() => {
    if (!values.state) {
      setCityList([]);
      return;
    }
    const matchedCountry = countryList.find(
      (c) => c._id === values.country || String(c.id) === values.country || c.name.trim().toLowerCase() === values.country.trim().toLowerCase()
    );
    const matchedState = stateList.find(
      (s) => s._id === values.state || String(s.id) === values.state || s.name.trim().toLowerCase() === values.state.trim().toLowerCase()
    );
    if (!matchedState) return;

    let active = true;
    getPublicCities(matchedCountry?.id, matchedState.id, 1)
      .then((res) => {
        if (active && res.success && Array.isArray(res.data)) {
          setCityList(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch cities:", err);
      });

    return () => {
      active = false;
    };
  }, [values.country, values.state, countryList, stateList]);

  // Ensure user is loaded from store or fetched if not initialized
  useEffect(() => {
    if (!initialized && !loading) {
      fetchUser();
    }
  }, [initialized, loading, fetchUser]);

  // Populate form values from user store
  useEffect(() => {
    if (user) {
      setValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobile: user.mobile || "",
        country: user.countryId || user.country || "",
        state: user.stateId || user.state || "",
        city: user.cityId || user.city || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  // Normalize location values once lists are loaded if they were names
  useEffect(() => {
    if (!values.country || countryList.length === 0) return;
    const match = countryList.find(
      (c) => c.name.trim().toLowerCase() === values.country.trim().toLowerCase()
    );
    if (match && match._id && values.country !== match._id) {
      setValues((v) => ({ ...v, country: match._id }));
    }
  }, [countryList, values.country]);

  useEffect(() => {
    if (!values.state || stateList.length === 0) return;
    const match = stateList.find(
      (s) => s.name.trim().toLowerCase() === values.state.trim().toLowerCase()
    );
    if (match && match._id && values.state !== match._id) {
      setValues((v) => ({ ...v, state: match._id }));
    }
  }, [stateList, values.state]);

  useEffect(() => {
    if (!values.city || cityList.length === 0) return;
    const match = cityList.find(
      (c) => c.name.trim().toLowerCase() === values.city.trim().toLowerCase()
    );
    if (match && match._id && values.city !== match._id) {
      setValues((v) => ({ ...v, city: match._id }));
    }
  }, [cityList, values.city]);

  const set = (key: keyof Values, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const countryOptions = countryList.map((c) => ({ label: c.name, value: c._id }));
  const stateOptions = stateList.map((s) => ({ label: s.name, value: s._id }));
  const cityOptions = cityList.map((c) => ({ label: c.name, value: c._id }));

  const changeCountry = (countryId: string) => {
    setValues((v) => ({ ...v, country: countryId, state: "", city: "" }));
  };

  const changeState = (stateId: string) => {
    setValues((v) => ({ ...v, state: stateId, city: "" }));
  };

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
      const { data } = await http.patch<UserProfileResponse, Values>("/auth/profile", values);
      setUser(data);
      setValues({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        mobile: data.mobile || "",
        country: data.countryId || data.country || "",
        state: data.stateId || data.state || "",
        city: data.cityId || data.city || "",
        profileImage: data.profileImage || "",
      });
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
            <tr><th>Country :</th><td><Dropdown ariaLabel="Country" value={values.country} onChange={changeCountry} options={countryOptions} /></td></tr>
            <tr><th>State :</th><td><Dropdown ariaLabel="State" value={values.state} onChange={changeState} options={stateOptions} /></td></tr>
            <tr><th>City :</th><td><Dropdown ariaLabel="City" value={values.city} onChange={(v) => set("city", v)} options={cityOptions} /></td></tr>
            <tr><th>Profile Image :</th><td><input type="file" accept="image/*" className="form-control lb-ca-input" onChange={(e) => handleFile(e.target.files?.[0])} /></td></tr>
          </tbody>
        </table>
        <div className="text-end mt-3"><button type="submit" className="btn lb-btn-primary" disabled={saving}>{saving ? "Saving..." : "Submit"}</button></div>
      </div>
    </form>
  );
}
