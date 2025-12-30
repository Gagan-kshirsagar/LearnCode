"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const playlistSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});
const CreatePlaylistModel = ({ isOpen, onClose, onSubmit }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const handelFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      reset();
      onClose();
    } catch (errors) {
      toast.error("Failed to create playlist");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Create a new playlist to organize your favorite problems
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
      <form onSubmit={handleSubmit(handelFormSubmit)}>
        <div>
          <Label htmlFor="name">Playlist Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter playlist name"
            className="mt-1"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors?.name?.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter playlist description"
            className="mt-1"
          />
          {errors?.description && (
            <p className="text-sm text-red-500 mt-1">
              {errors?.description?.message}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant={"outline"}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Playlist"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreatePlaylistModel;
