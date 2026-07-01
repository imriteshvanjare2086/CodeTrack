import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Goal } from "./types";
import { motion } from "framer-motion";

interface AddGoalModalProps {
  onClose: () => void;
  onSave: (goal: Goal) => void;
}

const CATEGORIES = ["DSA", "Competitive Programming", "LeetCode", "Codeforces", "CodeChef", "Web Dev", "OOPs", "SQL"] as const;

export function AddGoalModal({ onClose, onSave }: AddGoalModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [targetNumber, setTargetNumber] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSave = () => {
    if (!title.trim() || !category) return;
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      targetNumber: targetNumber.trim() || undefined,
      deadline: deadline || undefined,
      status: "Not Started",
      progress: 0,
    };
    onSave(newGoal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass w-full max-w-md rounded-3xl border border-border/50 p-6 shadow-2xl overflow-hidden relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="font-heading text-xl font-bold text-foreground mb-6">Create New Goal</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Goal Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Solve 50 DSA problems"
              className="bg-card/50"
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-card/50">
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target Number</Label>
              <Input
                type="number"
                value={targetNumber}
                onChange={(e) => setTargetNumber(e.target.value)}
                placeholder="e.g., 50 (optional)"
                className="bg-card/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Deadline (Optional)</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-card/50"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !category} className="flex-1 rounded-xl">
            Save Goal
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
