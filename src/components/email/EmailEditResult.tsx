import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateEmail } from "@/lib/hooks/useEmailApi";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import useTranslation from "@/lib/hooks/useTranslation";
import getEmailTypeStyle from "@/lib/constants/emailTypes";
import type { Email, ExtractResultType } from "@/types";

export default function EmailEditResult({ email }: { email: Email }) {
    const { t } = useTranslation();
    const [editEmailResult, setEditEmailResult] = useState(email.emailResult || "");
    const [editEmailType, setEditEmailType] = useState<ExtractResultType>(email.emailType);

    const updateEmailMutation = useUpdateEmail();

    useEffect(() => {
        setEditEmailResult(email.emailResult || "");
        setEditEmailType(email.emailType);
    }, [email.emailResult, email.emailType]);

    const handleSave = async () => {
        try {
            const resultToSave = editEmailType === "none" ? null : editEmailResult;
            await updateEmailMutation.mutateAsync({
                emailId: email.id,
                emailResult: resultToSave,
                emailType: editEmailType,
            });
        } catch (error) {
            console.error('Failed to update email:', error);
        }
    };

    const handleCancel = () => {
        setEditEmailResult(email.emailResult || "");
        setEditEmailType(email.emailType);
    };

    const currentConfig = getEmailTypeStyle(editEmailType);

    return (
        <div className={`flex items-center p-2.5 rounded-lg ${currentConfig.bgClass}`}>
            <div className="flex-1 flex items-center">
                <Select value={editEmailType} onValueChange={(value) => {
                    setEditEmailType(value as ExtractResultType);
                    if (value === "none") {
                        setEditEmailResult("");
                    }
                }}>
                    <SelectTrigger className="text-xs w-20 border border-border bg-background px-2">
                        <SelectValue placeholder={t('emailType')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="internal_link">{t('emailTypeInternalLink')}</SelectItem>
                        <SelectItem value="auth_code">{t('emailTypeAuthCode')}</SelectItem>
                        <SelectItem value="auth_link">{t('emailTypeAuthLink')}</SelectItem>
                        <SelectItem value="service_link">{t('emailTypeServiceLink')}</SelectItem>
                        <SelectItem value="subscription_link">{t('emailTypeSubscriptionLink')}</SelectItem>
                        <SelectItem value="other_link">{t('emailTypeOtherLink')}</SelectItem>
                        <SelectItem value="none">{t('emailTypeNone')}</SelectItem>
                    </SelectContent>
                </Select>
                {editEmailType !== "none" && (
                    <Input
                        value={editEmailResult}
                        onChange={(e) => setEditEmailResult(e.target.value)}
                        placeholder={t('emailResultPlaceholder')}
                        className={`text-xs border border-border bg-background px-2 flex-1 ${currentConfig.textClass}`}
                    />
                )}
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleCancel}
                    disabled={updateEmailMutation.isPending}
                >
                    <X />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-500 hover:bg-green-500/10 hover:text-green-500"
                    onClick={handleSave}
                    disabled={updateEmailMutation.isPending}
                >
                    <Check />
                </Button>
            </div>
        </div>
    );
}
