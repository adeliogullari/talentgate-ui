"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookUser,
  CalendarIcon,
  HomeIcon,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { retrieveCareerJob } from "./_lib/jobSlice";
import {
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
  createJobApplication,
  JobApplicationRequest,
  resetApplicationForm,
} from "./_lib/formSlice";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useParams } from "next/navigation";
import { Oval } from "react-loader-spinner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Full Name must be at least 2 characters")
    .max(100, "Full Name must be at most 100 characters"),

  email: z.string().trim().email("Invalid email address"),

  phone_number: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be at most 200 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be at most 100 characters"),

  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(100, "State must be at most 100 characters"),

  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be at most 100 characters"),

  zip_code: z
    .string()
    .trim()
    .regex(/^\d{4,10}$/, "Invalid Zip Code (Must be 4-10 digits)"),

  linkedin_url: z
    .string()
    .trim()
    .refine(
      (val) => val.includes("linkedin.com/in/"),
      "Must be a LinkedIn profile URL"
    )
    .optional(),

  external_website_url: z.string().url("Invalid URL").optional(),

  cover_letter: z
    .string()
    .trim()
    .min(10, "Cover Letter must be at least 10 characters")
    .max(2000, "Cover Letter must be at most 2000 characters")
    .optional(),
});

const ApplyPage = ({ params }: { params: { job_id: string } }) => {
  // Local States
  const [tab, setTab] = useState<string>("job details");

  // Redux States
  const dispatch = useAppDispatch();
  const applicationFormState = useAppSelector(
    (state) => state.applicationFormReducer
  );
  const applicationFormData = useAppSelector(
    (state) => state.applicationFormReducer.form_fields
  );
  const formErrors = useAppSelector(
    (state) => state.applicationFormReducer.form_errors
  );
  const job = useAppSelector((state) => state.careerJobReducer.job || {});
  const loading = useAppSelector((state) => state.careerJobReducer.loading);

  // Parameters
  const company_id = useParams().company_id.toString();

  // Effects
  useEffect(() => {
    if (job?.id !== Number(params.job_id)) {
      dispatch(
        retrieveCareerJob({
          job_id: Number(params.job_id),
          company_id: Number(company_id),
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (applicationFormState.loading === "succeeded") {
      onTabChange("job details");
      dispatch(resetApplicationForm());
      toast.success("Application submitted successfully");
    }

    if (applicationFormState.loading === "failed") {
      toast.error("There was an error: " + applicationFormState.error);
    }
  }, [applicationFormState.loading]);

  // Handle Functions
  const onTabChange = (value: string) => {
    setTab(value);
  };

  const validateForm = () => {
    const result = formSchema.safeParse(applicationFormData);

    if (!result.success) {
      // Extract Zod errors and map them to Redux error state
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0]] = err.message;
        }
      });

      dispatch(setFormErrors(newErrors));
      return false;
    }

    dispatch(setFormErrors({})); // Clear errors if validation passes
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const reqBody: JobApplicationRequest = {
      ...applicationFormData,
      job_id: params.job_id,
      company_id: company_id,
    };

    dispatch(createJobApplication(reqBody));
  };

  const handleApplyButtonClick = (value: string) => {
    setTab(value);
    if (window.scrollY > 100) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Dropzone
  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        console.log(acceptedFiles);
      };
    });
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    maxSize: 50000000,
  });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.name} className="text-destructive">
        {file.name}
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    );
  });

  // Render
  if (loading === "failed") {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl font-bold">
          Failed to load the requested job.
        </h1>
        <Link href={"../careers"}>
          <Button className="gap-2">
            <span>
              <ArrowLeft className="size-4" />
            </span>
            <span>Go back to available jobs list</span>
          </Button>
        </Link>
      </div>
    );
  }

  if (loading === "pending") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Oval color="#ea580c" secondaryColor="gray" />
      </div>
    );
  }

  return (
    <div className="lg:w-1/2 lg:mx-auto">
      <Link href={`/company/${company_id}/careers`}>
        <Button className="absolute top-4 left-4" variant="ghost">
          <ArrowLeft />
        </Button>
      </Link>

      <div className="h-full flex flex-col gap-8 p-4 lg:max-w-[70dvw] lg:mx-auto">
        {/* JOB DETAIL BANNER */}
        <div className="flex flex-col gap-4 p-4 rounded-md bg-gradient-to-tr from-secondary to-primary lg:h-[45dvh] items-center lg:justify-center lg:gap-12">
          <div className="size-20 rounded-full bg-blue-700 grid place-items-center lg:size-40 lg:text-2xl">
            {company_id}
          </div>
          <h1 className="text-3xl font-semibold lg:text-5xl">{job?.title}</h1>
          <div className="flex gap-4 flex-wrap">
            <Badge className="w-fit h-fit flex gap-3">
              <span>
                <HomeIcon size={24} />
              </span>
              <span>{job?.location?.type}</span>
            </Badge>
            <Badge className="w-fit h-fit flex gap-3">
              <span>
                <MapPin size={24} />
              </span>
              <p>
                {job?.location?.address?.country},{" "}
                {job?.location?.address?.city}, {job?.location?.address?.state}
              </p>
            </Badge>
            <Badge className="w-fit h-fit flex gap-3">
              <span>
                <BookUser size={24} />
              </span>
              <span>{job?.department}</span>
            </Badge>
          </div>
        </div>

        {/* JOB APPLICATION FORM / JOB DESCRIPTION TABS */}
        <Tabs value={tab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="job details">Job Details</TabsTrigger>
            <TabsTrigger value="apply">Apply</TabsTrigger>
          </TabsList>

          {/* JOB DETAILS TAB */}
          <TabsContent value="job details">
            <Card>
              <CardHeader className="h-fit pb-0">
                <ReactQuill
                  value={job?.description}
                  theme="bubble"
                  readOnly={true}
                  className="quillComponent h-fit"
                />
              </CardHeader>

              {/* CTA GROUP */}
              <CardFooter className="w-full grid place-items-center">
                <div className="grid gap-6 place-items-center w-full lg:w-96 lg:pt-12">
                  <Button
                    className="w-full"
                    onClick={() => handleApplyButtonClick("apply")}
                  >
                    Apply
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* APPLY TAB */}
          <TabsContent value="apply">
            <Card>
              {/* DRAG AND DROP CV SECTION */}
              <CardHeader>
                <CardTitle>Upload CV</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`w-full h-fit border-2 ${
                    isDragActive ? "border-white" : ""
                  }  mt-2 rounded-md border-dashed space-y-2 p-2 text-muted-foreground/40`}
                >
                  <input {...getInputProps()} />
                  <p>
                    <span className="text-primary/80 hover:text-primary active:text-primary/60">
                      Upload your CV
                    </span>{" "}
                    or drag and drop here.
                  </p>
                  <p>Accepted files: PDF, DOC and DOCX up to 50MB.</p>
                  {acceptedFiles.length > 0 && (
                    <>
                      <p className="text-green-500 font-semibold">
                        Accepted file(s):
                      </p>
                      <p className="text-green-500">{acceptedFiles[0].name}</p>
                    </>
                  )}
                  {fileRejections.length > 0 && (
                    <p className="text-destructive font-semibold">
                      File(s) rejected:
                    </p>
                  )}
                  {fileRejectionItems}
                </div>
              </CardContent>

              <hr />

              {/* MY INFORMATION SECTION */}
              <CardHeader>
                <CardTitle>My Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Full Name"
                    onChange={(e) => {
                      if (formErrors?.full_name) dispatch(setFormErrors({}));
                      dispatch(updateFullName(e.target.value));
                    }}
                    className={cn(
                      formErrors?.full_name
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.full_name && (
                    <p className="text-destructive">{formErrors.full_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    placeholder="Email Address"
                    onChange={(e) => {
                      if (formErrors?.email) dispatch(setFormErrors({}));
                      dispatch(updateEmail(e.target.value));
                    }}
                    className={cn(
                      formErrors?.email
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.email && (
                    <p className="text-destructive">{formErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input
                    onChange={(e) => {
                      if (formErrors?.phone_number) dispatch(setFormErrors({}));
                      dispatch(updatePhoneNumber(e.target.value));
                    }}
                    placeholder="Phone Number"
                    className={cn(
                      formErrors?.phone_number
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.phone_number && (
                    <p className="text-destructive">
                      {formErrors.phone_number}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Input
                    onChange={(e) => {
                      if (formErrors?.country) dispatch(setFormErrors({}));
                      dispatch(updateCountry(e.target.value));
                    }}
                    placeholder="Country"
                    className={cn(
                      formErrors?.country
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.country && (
                    <p className="text-destructive">{formErrors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Input
                    onChange={(e) => {
                      if (formErrors?.address) dispatch(setFormErrors({}));
                      dispatch(updateAddress(e.target.value));
                    }}
                    placeholder="Address"
                    className={cn(
                      formErrors?.address
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.address && (
                    <p className="text-destructive">{formErrors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input
                    onChange={(e) => {
                      if (formErrors?.city) dispatch(setFormErrors({}));
                      dispatch(updateCity(e.target.value));
                    }}
                    placeholder="City"
                    className={cn(
                      formErrors?.city
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.city && (
                    <p className="text-destructive">{formErrors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Province / State *</Label>
                  <Input
                    onChange={(e) => {
                      if (formErrors?.state) dispatch(setFormErrors({}));
                      dispatch(updateState(e.target.value));
                    }}
                    placeholder="Province / State"
                    className={cn(
                      formErrors?.state
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.state && (
                    <p className="text-destructive">{formErrors.state}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Postal Code *</Label>
                  <Input
                    onChange={(e) => {
                      if (formErrors?.zip_code) dispatch(setFormErrors({}));
                      dispatch(updateZipCode(e.target.value));
                    }}
                    placeholder="Postal Code"
                    className={cn(
                      formErrors?.zip_code
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.zip_code && (
                    <p className="text-destructive">{formErrors.zip_code}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {applicationFormData?.start_date ? (
                          applicationFormData?.start_date
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          applicationFormData?.start_date
                            ? new Date(applicationFormData?.start_date)
                            : undefined
                        }
                        onSelect={(date) => {
                          dispatch(updateStartDate(date?.toDateString()));
                        }}
                        disabled={(date: any) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    placeholder="LinkedIn URL"
                    onChange={(e) => {
                      if (formErrors?.email) dispatch(setFormErrors({}));
                      dispatch(updateLinkedInUrl(e.target.value));
                    }}
                    className={cn(
                      formErrors?.linkedin_url
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.linkedin_url && (
                    <p className="text-destructive">
                      {formErrors.linkedin_url}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Website, Blog, or Portfolio</Label>
                  <Input
                    placeholder="Website, Blog, or Portfolio"
                    onChange={(e) => {
                      if (formErrors?.external_website_url)
                        dispatch(setFormErrors({}));
                      dispatch(updateExternalWebsiteUrl(e.target.value));
                    }}
                    className={cn(
                      formErrors?.external_website_url
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                  />
                  {formErrors?.external_website_url && (
                    <p className="text-destructive">
                      {formErrors.external_website_url}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Cover Letter</Label>
                  <Textarea
                    className={cn(
                      "resize-none md:resize-y",
                      formErrors?.cover_letter
                        ? "border-destructive dark:border-destructive"
                        : ""
                    )}
                    onChange={(e) => {
                      if (formErrors?.cover_letter) dispatch(setFormErrors({}));
                      dispatch(updateCoverLetter(e.target.value));
                    }}
                    placeholder="You can write your cover letter here ..."
                  />
                  {formErrors?.cover_letter && (
                    <p className="text-destructive">
                      {formErrors.cover_letter}
                    </p>
                  )}
                </div>
                <Button type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApplyPage;
