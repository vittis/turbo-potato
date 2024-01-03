import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { queryClient } from "@/services/api/queryClient";

const FormSchema = z.object({
  name: z.string().min(4, { message: "Name must be at least 4 characters" }).max(30, {
    message: "Name must not be longer than 30 characters.",
  }),
  description: z
    .string()
    .max(40, {
      message: "Description must not be longer than 40 characters.",
    })
    .optional(),
  capacity: z.coerce
    .number()
    .min(2, { message: "Capacity must be at least 2" })
    .max(8, { message: "Capacity must not be higher than 8." }),
});

interface CreateRoomDrawerProps {}

async function createRoom(data) {
  const res = await fetch("http://localhost:8080/api/rooms/create", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
}

const CreateRoomDrawer = ({}: CreateRoomDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 2,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createRoom,
    mutationKey: ["lobby/createRoom"],
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["lobby/rooms"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await mutateAsync(data);
    setIsOpen(false);
    // todo toast
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)} type="button" size="sm" variant="outline">
        Create Room
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
          <DialogDescription>Customize your room settings.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description (optional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Capacity" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { CreateRoomDrawer };
