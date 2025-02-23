import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface JobApplicationRequest {
  cv_url?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  start_date?: string;
  linkedin_url?: string;
  external_website_url?: string;
  cover_letter?: string;
  job_id?: string;
  company_id?: string;
}

export interface JobApplicationResponse {
  id?: number;
  cv_url?: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  start_date?: string;
  linkedin_url?: string;
  external_website_url?: string;
  cover_letter?: string;
}

export interface ErrorResponse {
  detail: string;
}

export const createJobApplication = createAsyncThunk<
  JobApplicationResponse,
  JobApplicationRequest,
  {
    rejectValue: ErrorResponse;
  }
>("createJobApplication", async (request, thunkAPI) => {
  const response = await fetch(`http://localhost:8001/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (response.status === 201) {
    return thunkAPI.fulfillWithValue(await response.json());
  }
  return thunkAPI.rejectWithValue(await response.json());
});

export interface FormFields {
  cv_url: string | undefined;
  full_name: string | undefined;
  email: string | undefined;
  phone_number: string | undefined;
  address: string | undefined;
  city: string | undefined;
  state: string | undefined;
  country: string | undefined;
  zip_code: string | undefined;
  start_date: string | undefined;
  linkedin_url: string | undefined;
  external_website_url: string | undefined;
  cover_letter: string | undefined;
}

export interface FormState {
  form_fields: FormFields;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | undefined;
  form_errors: Record<string, string> | undefined;
}

const FormInitialState = {
  form_fields: {},
  loading: "idle",
  error: undefined,
  form_errors: undefined,
} as Partial<FormState>;

export const formSlice = createSlice({
  name: "formSlice",
  initialState: FormInitialState,
  reducers: {
    updateCvUrl: (state, action) => {
      state.form_fields!.cv_url = action.payload;
    },
    updateFullName: (state, action) => {
      state.form_fields!.full_name = action.payload;
    },
    updateEmail: (state, action) => {
      state.form_fields!.email = action.payload;
    },
    updatePhoneNumber: (state, action) => {
      state.form_fields!.phone_number = action.payload;
    },
    updateAddress: (state, action) => {
      state.form_fields!.address = action.payload;
    },
    updateCity: (state, action) => {
      state.form_fields!.city = action.payload;
    },
    updateState: (state, action) => {
      state.form_fields!.state = action.payload;
    },
    updateCountry: (state, action) => {
      state.form_fields!.country = action.payload;
    },
    updateZipCode: (state, action) => {
      state.form_fields!.zip_code = action.payload;
    },
    updateStartDate: (state, action) => {
      state.form_fields!.start_date = action.payload;
    },
    updateLinkedInUrl: (state, action) => {
      state.form_fields!.linkedin_url = action.payload;
    },
    updateExternalWebsiteUrl: (state, action) => {
      state.form_fields!.external_website_url = action.payload;
    },
    updateCoverLetter: (state, action) => {
      state.form_fields!.cover_letter = action.payload;
    },
    setFormErrors: (state, action) => {
      state.form_errors = action.payload;
    },
    resetApplicationForm: (state) => {
      state.form_fields = {} as FormFields;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createJobApplication.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(createJobApplication.fulfilled, (state, action) => {
      state.loading = "succeeded";
    });
    builder.addCase(createJobApplication.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload?.detail;
    });
  },
});

export const {
  updateCvUrl,
  updateFullName,
  updateEmail,
  updatePhoneNumber,
  updateAddress,
  updateCity,
  updateState,
  updateCountry,
  updateZipCode,
  updateStartDate,
  updateLinkedInUrl,
  updateExternalWebsiteUrl,
  updateCoverLetter,
  setFormErrors,
  resetApplicationForm,
} = formSlice.actions;

export default formSlice.reducer;
