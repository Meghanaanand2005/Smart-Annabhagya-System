import { useState } from "react";
import { MessageCircle, Send, AlertCircle, Calendar, Clock, ShoppingCart, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface RationDetails {
  rice: string;
  ragi: string;
  wheat: string;
  sugar: string;
  additional: string;
}

export default function WhatsAppBroadcast() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [ration, setRation] = useState<RationDetails>({
    rice: "",
    ragi: "",
    wheat: "",
    sugar: "",
    additional: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!timeSlot.trim()) newErrors.timeSlot = "Time slot is required";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    const hasRation =
      ration.rice.trim() ||
      ration.ragi.trim() ||
      ration.wheat.trim() ||
      ration.sugar.trim() ||
      ration.additional.trim();

    if (!hasRation) {
      newErrors.ration = "At least one ration item is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildRationList = () => {
    const items: string[] = [];
    if (ration.rice.trim()) items.push(`• Rice: ${ration.rice} kg`);
    if (ration.ragi.trim()) items.push(`• Ragi: ${ration.ragi} kg`);
    if (ration.wheat.trim()) items.push(`• Wheat: ${ration.wheat} kg`);
    if (ration.sugar.trim()) items.push(`• Sugar: ${ration.sugar} kg`);
    if (ration.additional.trim()) {
      const additionalItems = ration.additional
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      additionalItems.forEach((item) => items.push(`• ${item}`));
    }
    return items.length > 0 ? items.join("\n") : "• (No items specified)";
  };

  const previewMessage = `
📢 *Ration Distribution Notice*

📅 From: ${startDate || "[Start Date]"}
📅 To: ${endDate || "[End Date]"}
⏰ Time: ${timeSlot || "[Time Slot]"}

🛒 Available Rations:
${buildRationList()}

Please visit the ration shop within the given schedule.

- Government Distribution System
  `.trim();

  const handleOpenConfirm = () => {
    if (validate()) {
      setShowConfirmDialog(true);
    }
  };

  const handleSend = () => {
    setShowConfirmDialog(false);
    const encodedMessage = encodeURIComponent(previewMessage);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    setShowSuccessDialog(true);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setTimeSlot("");
    setRation({ rice: "", ragi: "", wheat: "", sugar: "", additional: "" });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl text-indigo-900">WhatsApp Broadcast</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and send ration availability notices to beneficiaries via WhatsApp
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleReset}
          className="self-start sm:self-auto"
        >
          Reset Form
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              Broadcast Details
            </CardTitle>
            <CardDescription>
              Fill in the distribution schedule and available rations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate) {
                      setErrors((prev) => ({ ...prev, startDate: "" }));
                    }
                  }}
                  aria-invalid={!!errors.startDate}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (errors.endDate) {
                      setErrors((prev) => ({ ...prev, endDate: "" }));
                    }
                  }}
                  aria-invalid={!!errors.endDate}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <Label htmlFor="timeSlot" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-600" />
                Time Slot
              </Label>
              <Input
                id="timeSlot"
                type="text"
                placeholder="e.g. 9:00 AM – 4:00 PM"
                value={timeSlot}
                onChange={(e) => {
                  setTimeSlot(e.target.value);
                  if (errors.timeSlot) {
                    setErrors((prev) => ({ ...prev, timeSlot: "" }));
                  }
                }}
                aria-invalid={!!errors.timeSlot}
              />
              {errors.timeSlot && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.timeSlot}
                </p>
              )}
            </div>

            {/* Ration Details */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-green-600" />
                Available Rations (kg)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "rice" as const, label: "Rice", placeholder: "e.g. 5" },
                  { key: "ragi" as const, label: "Ragi", placeholder: "e.g. 3" },
                  { key: "wheat" as const, label: "Wheat", placeholder: "e.g. 4" },
                  { key: "sugar" as const, label: "Sugar", placeholder: "e.g. 2" },
                ].map((item) => (
                  <div key={item.key} className="space-y-1">
                    <Label htmlFor={item.key} className="text-sm font-normal text-muted-foreground">
                      {item.label}
                    </Label>
                    <Input
                      id={item.key}
                      type="number"
                      min="0"
                      placeholder={item.placeholder}
                      value={ration[item.key]}
                      onChange={(e) => {
                        setRation((prev) => ({ ...prev, [item.key]: e.target.value }));
                        if (errors.ration) {
                          setErrors((prev) => ({ ...prev, ration: "" }));
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <Label htmlFor="additional" className="text-sm font-normal text-muted-foreground">
                  Additional Items (comma separated)
                </Label>
                <Textarea
                  id="additional"
                  placeholder="e.g. Kerosene: 1 Litre, Dal: 1 kg"
                  value={ration.additional}
                  onChange={(e) => {
                    setRation((prev) => ({ ...prev, additional: e.target.value }));
                    if (errors.ration) {
                      setErrors((prev) => ({ ...prev, ration: "" }));
                    }
                  }}
                  className="min-h-[60px] resize-none"
                />
              </div>
              {errors.ration && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.ration}
                </p>
              )}
            </div>

            {/* Send Button */}
            <Button
              onClick={handleOpenConfirm}
              className="w-full bg-green-600 hover:bg-green-700 text-white h-11"
            >
              <Send className="w-4 h-4" />
              Send via WhatsApp
            </Button>
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              Message Preview
            </CardTitle>
            <CardDescription>
              This is how your message will appear on WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-green-100 whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
              {previewMessage}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-indigo-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-green-600" />
              Confirm Broadcast
            </DialogTitle>
            <DialogDescription>
              You are about to open WhatsApp with the following message. Continue?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-lg p-4 max-h-60 overflow-y-auto whitespace-pre-wrap text-sm font-mono">
            {previewMessage}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4" />
              Open WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-indigo-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              WhatsApp Opened
            </DialogTitle>
            <DialogDescription>
              WhatsApp has been opened in a new tab. You can now select the recipients and send the message.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

