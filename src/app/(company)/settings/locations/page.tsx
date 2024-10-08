import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, PlusIcon } from "lucide-react";

const SettingsLocationsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Locations</h1>

      <div>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <CardTitle>Manage Locations</CardTitle>
              <CardDescription>
                Manage your company locations.
              </CardDescription>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-fit gap-1">
                  <span>
                    <PlusIcon className="size-4" />
                  </span>
                  <span>Add Location</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-left">
                  <DialogTitle>Add Location</DialogTitle>
                  <DialogDescription>
                    You can create a new location from this section. Click
                    save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid items-start gap-4 px-4 lg:px-0 lg:gap-8">
                  <div className="grid gap-2">
                    <Label htmlFor="locationName">Location Name</Label>
                    <Input
                      type="text"
                      id="locationName"
                      placeholder="Location Title"
                    />
                  </div>
                  <Button type="submit">Create New Location</Button>
                </div>
                <DialogFooter className="w-full">
                  <DialogClose className="w-full" asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location Name</TableHead>
                    <TableHead>Active Jobs at This Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>EMEA</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Istanbul, Turkey</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Talinn, Estonia</TableCell>
                    <TableCell>5</TableCell>
                    <TableCell>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsLocationsPage;
