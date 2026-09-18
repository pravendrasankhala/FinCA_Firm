"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/SortableList";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validations/team";
import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberPublished,
  reorderTeamMembers,
} from "@/app/admin/team/actions";
import type { TeamMember } from "@prisma/client";

export function TeamManager({ members }: { members: TeamMember[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Drag to reorder.</p>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">No team members yet.</p>
      ) : (
        <SortableList
          items={members}
          onReorder={reorderTeamMembers}
          renderItem={(member) => (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
                <p className="truncate text-xs text-muted-foreground">{member.designation}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {!member.published && <Badge variant="secondary">Hidden</Badge>}
                <PublishToggle
                  id={member.id}
                  defaultChecked={member.published}
                  onToggle={toggleTeamMemberPublished}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(member);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton onDelete={() => deleteTeamMember(member.id)} itemLabel="Team member" />
              </div>
            </div>
          )}
        />
      )}

      <TeamDialog open={open} onOpenChange={setOpen} member={editing} />
    </div>
  );
}

function TeamDialog({
  open,
  onOpenChange,
  member,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember | null;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberInput>({
    resolver: zodResolver(teamMemberSchema),
    values: {
      name: member?.name ?? "",
      designation: member?.designation ?? "",
      qualification: member?.qualification ?? "",
      biography: member?.biography ?? "",
      experience: member?.experience ?? "",
      photoUrl: member?.photoUrl ?? "",
      linkedinUrl: member?.linkedinUrl ?? "",
      email: member?.email ?? "",
      published: member?.published ?? true,
    },
  });

  const onSubmit = async (values: TeamMemberInput) => {
    const result = member
      ? await updateTeamMember(member.id, values)
      : await createTeamMember(values);
    if (result.success) {
      toast.success(member ? "Team member updated." : "Team member added.");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tm-name">Name</Label>
              <Input id="tm-name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tm-designation">Designation</Label>
              <Input id="tm-designation" {...register("designation")} />
              {errors.designation && (
                <p className="text-xs text-destructive">{errors.designation.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tm-qualification">Qualification</Label>
              <Input id="tm-qualification" {...register("qualification")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tm-experience">Experience</Label>
              <Input id="tm-experience" {...register("experience")} placeholder="e.g. 12+ years" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tm-bio">Biography</Label>
            <Textarea id="tm-bio" rows={3} {...register("biography")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tm-photo">Photo URL</Label>
              <Input id="tm-photo" {...register("photoUrl")} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tm-linkedin">LinkedIn URL</Label>
              <Input id="tm-linkedin" {...register("linkedinUrl")} placeholder="https://..." />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tm-email">Email</Label>
            <Input id="tm-email" type="email" {...register("email")} />
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="tm-published"
            />
            <Label htmlFor="tm-published">Published</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
