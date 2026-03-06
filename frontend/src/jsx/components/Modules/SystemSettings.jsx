import React, { useState } from 'react';
import { C, S } from '../../constants';
import { useLS } from '../../utils';
import { Tabs } from '../UI/Tabs';
import { Card } from '../UI/Card';
import { Field } from '../UI/Field';

export default function SystemSettings() {
    const [profile, setProfile] = useLS("axiom_profile", { name: "", email: "", company: "", role: "Developer", phone: "", timezone: "America/Los_Angeles" });
    const [apiKeys, setApiKeys] = useLS("axiom_api_keys", { anthropic: "", openai: "", groq: "", together: "", costar: "", regrid: "", attom: "", google: "" });
    const [saved, setSaved] = useState("");

    const doSave = (label) => { setSaved(label); setTimeout(() => setSaved(""), 2000); };
    const pu = k => e => setProfile({ ...profile, [k]: e.target.value });
    const au = k => e => setApiKeys({ ...apiKeys, [k]: e.target.value });

    return (
        <Tabs tabs={["Profile", "API Keys", "Notifications", "Team", "Data"]}>
            <div>
                <Card title="User Profile">
                    <div style={S.g3}>
                        <Field label="Full Name"><input style={S.inp} value={profile.name} onChange={pu("name")} /></Field>
                        <Field label="Email"><input style={S.inp} value={profile.email} onChange={pu("email")} /></Field>
                        <Field label="Company"><input style={S.inp} value={profile.company} onChange={pu("company")} /></Field>
                    </div>
                    <button style={{ ...S.btn("gold"), marginTop: 10 }} onClick={() => doSave("profile")}>{saved === "profile" ? "✓ Profile Saved!" : "Save Profile"}</button>
                </Card>
            </div>
            <div>
                <Card title="API Key Management">
                    {[["Anthropic (Claude)", "anthropic"], ["OpenAI", "openai"]].map(([label, key]) => (
                        <Field key={key} label={label}>
                            <input style={S.inp} type="password" value={apiKeys[key]} onChange={au(key)} />
                        </Field>
                    ))}
                    <button style={{ ...S.btn("gold"), marginTop: 10 }} onClick={() => doSave("api")}>{saved === "api" ? "✓ API Keys Saved!" : "Save API Keys"}</button>
                </Card>
            </div>
        </Tabs>
    );
}
