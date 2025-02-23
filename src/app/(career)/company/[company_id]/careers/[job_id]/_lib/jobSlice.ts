import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface CareerJobResponse {
  id?: number;
  title?: string;
  department?: string;
  description?: string;
  employment_type?: string;
  job_post_deadline?: string;
  location?: {
    id?: number;
    type?: string;
    latitude?: number;
    longitude?: number;
    address?: {
      id?: number;
      unit?: string;
      street?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  };
  company_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ErrorResponse {
  detail: string;
}

export interface CareerJobRequest {
  job_id: number;
  company_id: number;
}

export const retrieveCareerJob = createAsyncThunk<
  CareerJobResponse,
  CareerJobRequest,
  {
    rejectValue: ErrorResponse;
  }
>("retrieveCareerJob", async ({job_id, company_id}, thunkAPI) => {
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/careers/companies/${company_id}/jobs/${job_id}`,
  //   {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   }
  // );
  const response = await fetch(
    `http://localhost:8001/jobs/${job_id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (response.status === 200) {
    return thunkAPI.fulfillWithValue(await response.json());
  }
  return thunkAPI.rejectWithValue(await response.json());
});

export interface CareerJobState {
  job: CareerJobResponse;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | undefined;
}

const CareerJobInitialState = {
  job: {},
  loading: "idle",
  error: undefined,
} as Partial<CareerJobState>;

export const careerJobSlice = createSlice({
  name: "careerJobSlice",
  initialState: CareerJobInitialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(retrieveCareerJob.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(retrieveCareerJob.fulfilled, (state, action) => {
      state.job = { ...action.payload };
      state.loading = "succeeded";
    });
    builder.addCase(retrieveCareerJob.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload?.detail;
    });
  },
});

export default careerJobSlice.reducer;
