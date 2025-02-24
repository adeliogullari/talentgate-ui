"use client";

import { Button } from "@/components/ui/button";
import {
  Building2,
  CheckIcon,
  ClipboardIcon,
  Clock9,
  FacebookIcon,
  Filter,
  FilterX,
  Laptop,
  LinkedinIcon,
  MapPin,
  SearchIcon,
  TwitterIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { retrieveCareerJobs } from "./_lib/slice";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Oval } from "react-loader-spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface FilterGroup {
  title: string;
  EmploymentType: { id: number; label: string; checked: boolean }[];
  locationType: { id: number; label: string; checked: boolean }[];
  department: { id: number; label: string; checked: boolean }[];
}

const filterGroup: FilterGroup = {
  title: "",
  EmploymentType: [
    {
      id: 0,
      label: "Full-Time",
      checked: false,
    },
    {
      id: 1,
      label: "Part-Time",
      checked: false,
    },
    {
      id: 2,
      label: "Internship",
      checked: false,
    },
  ],
  locationType: [
    {
      id: 0,
      label: "Remote",
      checked: false,
    },
    {
      id: 1,
      label: "Hybrid",
      checked: false,
    },
    {
      id: 2,
      label: "Onsite",
      checked: false,
    },
  ],
  department: [
    {
      id: 0,
      label: "Engineering",
      checked: false,
    },
    {
      id: 1,
      label: "Marketing",
      checked: false,
    },
    {
      id: 2,
      label: "Sales",
      checked: false,
    },
    {
      id: 3,
      label: "Analytics",
      checked: false,
    },
  ],
};

type JobCardType = {
  id: string;
  title: string;
  description: string;
  employment_type: string;
  remote: string;
  department: string;
  location: {
    id: number;
    type: string;
    address: {
      city: string;
      state: string;
      country: string;
    };
  };
};

const JobCard = ({ job }: { job: JobCardType }) => {
  // Component States
  const [shareLinkTriggered, setShareLinkTriggered] = useState(false);

  // Router States
  const currentRoute = usePathname();
  const shareLink = `${process.env.NEXT_PUBLIC_BASE_URL}${currentRoute}/${job.id}`;

  // Functions
  const handleCopy = async () => {
    navigator.clipboard.writeText(shareLink);
    setShareLinkTriggered(true);
    setTimeout(() => setShareLinkTriggered(false), 2000);
  };

  // Render
  return (
    <div className="border p-6 rounded-md w-full flex flex-col lg:flex-row gap-8 lg:gap-0 group cursor-pointer">
      {/* TITLE & TAGS */}
      <Link href={`careers/${job.id}`} className="w-full h-full">
        <div className="space-y-4 w-5/6 h-full">
          <h3 className="text-2xl font-semibold group-hover:underline">
            {job.title}
          </h3>
          <div className="flex flex-wrap lg:flex-nowrap gap-3">
            <Badge className="gap-2">
              <span>
                <Clock9 />
              </span>
              <p>{job.employment_type}</p>
            </Badge>
            <Badge className="gap-2">
              <span>
                <Laptop />
              </span>
              <p>{job.location?.type}</p>
            </Badge>
            <Badge className="gap-2">
              <span>
                <Building2 />
              </span>
              <p>{job.department}</p>
            </Badge>
            <Badge className="gap-2">
              <span>
                <MapPin />
              </span>
              <p>
                {job.location?.address?.country}, {job.location?.address?.state}
                , {job.location?.address?.city}
              </p>
            </Badge>
          </div>
        </div>
      </Link>

      {/* CTA GROUP */}
      <div className="flex flex-col gap-4 lg:w-1/6">
        <Link href={`careers/${job.id}`}>
          <Button variant={"constructive"} className="w-full">
            Apply Now
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>Share</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share</DialogTitle>
              <DialogDescription>
                Share the oppurtunity with your friends!
              </DialogDescription>
              <div className="flex gap-4">
                <Input value={shareLink} readOnly />
                <Button
                  onClick={handleCopy}
                  className={cn("w-fit", [
                    shareLinkTriggered && "bg-green-600 hover:bg-green-600",
                  ])}
                >
                  {shareLinkTriggered ? (
                    <CheckIcon className="size-4" />
                  ) : (
                    <ClipboardIcon className="size-4" />
                  )}
                </Button>
              </div>
            </DialogHeader>
            <DialogClose asChild>
              <Button className="w-fit" variant={"outline"}>
                Close
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const CareerPage = () => {
  // Component States
  const [renderFilterGroup, setRenderFilterGroup] = useState(false);
  const [searchFieldValue, setSearchFieldValue] = useState("");
  const [filters, setFilters] = useState(filterGroup);

  // Redux States
  const dispatch = useAppDispatch();
  let jobs = useAppSelector((state) => state.careerJobsReducer.jobs || []);
  const loading = useAppSelector((state) => state.careerJobsReducer.loading);

  // Router States
  const company_id = useParams().company_id;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Functions
  const toggleFilterGroup = () => {
    setRenderFilterGroup(!renderFilterGroup);
  };

  const fetchJobs = (searchParams?: string) => {
    dispatch(
      retrieveCareerJobs({
        company_id: company_id,
        query_parameters: searchParams,
      })
    );
  };

  const changeSearchFieldValue = (e: any) => {
    setSearchFieldValue(e.target.value);
  };

  const handleSearchTitle = () => {
    setFilters({
      ...filters,
      title: searchFieldValue,
    });

    const params = new URLSearchParams(searchParams.toString());

    params.delete("title");
    
    if (!params.has("title") && searchFieldValue !== "") {
      params.append("title", searchFieldValue);
    }

    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const handleEmploymentTypeFilter = (id: number) => {
    const updatedFilters = { ...filters };
    updatedFilters.EmploymentType[id].checked =
      !updatedFilters.EmploymentType[id].checked;
    setFilters(updatedFilters);

    const params = new URLSearchParams(searchParams.toString());

    const label = updatedFilters.EmploymentType[id].label;

    if (updatedFilters.EmploymentType[id].checked) {
      params.append("employment_type", label);
    } else {
      params.delete("employment_type", label);
    }

    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const handleLocationTypeFilter = (id: number) => {
    const updatedFilters = { ...filters };
    updatedFilters.locationType[id].checked =
      !updatedFilters.locationType[id].checked;
    setFilters(updatedFilters);

    const params = new URLSearchParams(searchParams.toString());
    const label = updatedFilters.locationType[id].label;

    if (updatedFilters.locationType[id].checked) {
      params.append("location_type", label);
    } else {
      params.delete("location_type", label);
    }

    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const handleDepartmentFilter = (id: number) => {
    const updatedFilters = { ...filters };
    updatedFilters.department[id].checked =
      !updatedFilters.department[id].checked;
    setFilters(updatedFilters);

    const params = new URLSearchParams(searchParams.toString());
    const label = updatedFilters.department[id].label;

    if (updatedFilters.department[id].checked) {
      params.append("department", label);
    } else {
      params.delete("department", label);
    }

    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  // Effects
  useEffect(() => {
    if (loading === "idle") {
      fetchJobs();
    }
  }, [dispatch]);

  useEffect(() => {
    const titleParam = searchParams.get("title");
    const EmploymentTypeParam = searchParams.getAll("employment_type");
    const locationTypeParam = searchParams.getAll("location_type");
    const departmentParam = searchParams.getAll("department");

    setFilters((prevFilters) => ({
      ...prevFilters,
      title: titleParam?.toString() || "",
      EmploymentType: prevFilters.EmploymentType.map((item) => ({
        ...item,
        checked: EmploymentTypeParam.includes(item.label),
      })),
      locationType: prevFilters.locationType.map((item) => ({
        ...item,
        checked: locationTypeParam.includes(item.label),
      })),
      department: prevFilters.department.map((item) => ({
        ...item,
        checked: departmentParam.includes(item.label),
      })),
    }));

    fetchJobs(searchParams.toString());
  }, [searchParams]);

  // Render
  return (
    <div className="lg:pb-10">
      {/* HEADER */}
      <div className="flex items-center justify-around w-full sticky top-0 bg-background z-10 py-2">
        <Button>Company Link / Logo</Button>
        <div className="flex gap-4 items-center lg:gap-14">
          <LinkedinIcon></LinkedinIcon>
          <FacebookIcon></FacebookIcon>
          <TwitterIcon></TwitterIcon>
        </div>
      </div>

      <div className="lg:pb-24">
        {/* HERO BANNER */}
        <div className="flex flex-col bg-gradient-to-tr from-secondary to-primary py-14 lg:py-0 lg:h-[45dvh] lg:items-center lg:justify-center p-4 lg:p-0">
          <div className="grid place-items-center gap-6">
            <h1 className="text-4xl font-semibold text-center lg:text-5xl">
              Find your next career opportunity
            </h1>
            <p className="text-xl text-center">
              Explore our open positions and join our growing team.
            </p>
            <div className="w-3/4 lg:w-full h-fit relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearchTitle();
                }}
              >
                <Input
                  placeholder="Search"
                  className="w-full h-fit"
                  onChange={changeSearchFieldValue}
                  value={searchFieldValue}
                />
                <button type="submit" className="right-3 top-0 h-full absolute">
                  <SearchIcon className="stroke-muted-foreground" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-4 flex flex-col gap-12 lg:max-h-[55dvh] lg:flex-row lg:gap-32 lg:p-8 lg:pt-16">
          {/* FILTER GROUP */}
          <div className="w-fit">
            <Button
              className={`"flex gap-2 lg:hidden " ${
                renderFilterGroup && "mb-4"
              }`}
              onClick={() => toggleFilterGroup()}
            >
              <span>{renderFilterGroup ? <FilterX /> : <Filter />}</span>
              <span>Filters</span>
            </Button>

            <div
              className={cn("hidden w-full lg:flex flex-col gap-6", [
                renderFilterGroup && "flex",
              ])}
            >
              {/* JOB TYPE FILTER */}
              <div>
                <p className="font-semibold pb-2 text-lg">Job Type</p>
                <div className="flex flex-col gap-2">
                  {filterGroup.EmploymentType.map((item: any) => (
                    <div className="flex items-center gap-2" key={item.id}>
                      <Checkbox
                        className="rounded-[5px] size-6"
                        checked={filters.EmploymentType[item.id].checked}
                        onCheckedChange={() => {
                          handleEmploymentTypeFilter(item.id);
                        }}
                      />
                      <Label className="text-lg font-normal">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {/* REMOTE TYPE FILTER */}
              <div>
                <p className="font-semibold pb-2 text-lg text-nowrap">
                  On-Site / Remote
                </p>
                <div className="flex flex-col gap-2">
                  {filterGroup.locationType.map((item: any) => (
                    <div className="flex items-center gap-2" key={item.id}>
                      <Checkbox
                        className="rounded-[5px] size-6"
                        checked={filters.locationType[item.id].checked}
                        onCheckedChange={() => {
                          handleLocationTypeFilter(item.id);
                        }}
                      />
                      <Label className="text-lg font-normal">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              {/* DEPARTMENT FILTER */}
              <div>
                <p className="font-semibold pb-2 text-lg">Department</p>
                <div className="flex flex-col gap-2">
                  {filterGroup.department.map((item: any) => (
                    <div className="flex items-center gap-2" key={item.id}>
                      <Checkbox
                        className="rounded-[5px] size-6"
                        checked={filters.department[item.id].checked}
                        onCheckedChange={() => {
                          handleDepartmentFilter(item.id);
                        }}
                      />
                      <Label className="text-lg font-normal">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* JOBS GRID */}
          {loading === "succeeded" && (
            <div className="flex flex-col gap-4 w-full">
              {jobs.length > 0 ? (
                jobs.map((job: any) => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="w-full space-y-4 mx-auto text-center">
                  <h3 className="text-xl font-semibold">
                    Please check back later for new job opportunities.
                  </h3>
                </div>
              )}
            </div>
          )}
          {loading === "pending" && (
            <div className="w-full flex items-center justify-center">
              <Oval color="#ea580c" secondaryColor="gray" />
            </div>
          )}
          {loading === "failed" && (
            <div className="w-full space-y-4 mx-auto text-center">
              <h3 className="text-xl font-semibold">
                We couldn’t load job listings. Please try again.
              </h3>
              <Button className="mx-auto" onClick={() => fetchJobs()}>
                Retry loading jobs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPage;
