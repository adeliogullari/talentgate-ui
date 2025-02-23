import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "@/app/login/_lib/slice";
import registerReducer from "@/app/register/_lib/slice";
import careerJobsReducer from "@/app/(career)/company/[company_id]/careers/_lib/slice";
import careerJobReducer from "@/app/(career)/company/[company_id]/careers/[job_id]/_lib/jobSlice";
import applicationFormReducer from "@/app/(career)/company/[company_id]/careers/[job_id]/_lib/formSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      loginReducer: loginReducer,
      registerReducer: registerReducer,
      careerJobsReducer: careerJobsReducer,
      careerJobReducer: careerJobReducer,
      applicationFormReducer:  applicationFormReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
