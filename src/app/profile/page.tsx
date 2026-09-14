"use client";

import { useState } from "react";
import { useCarData } from "@/lib/store";
import { useUI } from "@/lib/uiStore";
import { formatThaiDate } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Card, Row, SectionHeader } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { FormField, PrimaryButton, SecondaryButton } from "@/components/FormField";

export default function ProfilePage() {
  const { appUser, updateAppUser, vehicle } = useCarData();
  const { showToast } = useUI();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(appUser.name);
  const [phone, setPhone] = useState(appUser.phone);
  const [email, setEmail] = useState(appUser.email);

  function openEdit() {
    setName(appUser.name);
    setPhone(appUser.phone);
    setEmail(appUser.email);
    setEditing(true);
  }

  function save() {
    updateAppUser({ name, phone, email });
    setEditing(false);
    showToast("บันทึกข้อมูลส่วนตัวแล้ว");
  }

  return (
    <div>
      <Header title="ข้อมูลส่วนตัว" />
      <div className="space-y-4 px-4 pt-4">
        <Card className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-bg text-[30px]">{appUser.avatar}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-ink">{appUser.name}</p>
            <p className="truncate text-[12px] text-ink/50">{appUser.email}</p>
            <p className="text-[11px] text-ink/40">สมาชิกตั้งแต่ {formatThaiDate(appUser.memberSince)}</p>
          </div>
        </Card>

        <div>
          <SectionHeader title="รายละเอียดบัญชี" />
          <Card className="divide-y divide-border">
            <Row icon="🧑" title="ชื่อ-นามสกุล" subtitle={appUser.name} onClick={openEdit} />
            <Row icon="📧" title="อีเมล" subtitle={appUser.email} onClick={openEdit} />
            <Row icon="📱" title="เบอร์โทรศัพท์" subtitle={appUser.phone} onClick={openEdit} />
          </Card>
        </div>

        <div>
          <SectionHeader title="รถของฉัน" />
          <Card>
            <Row icon="🚗" title={`${vehicle.brand} ${vehicle.model}`} subtitle={`${vehicle.plate} ${vehicle.province}`} href="/my-car" />
          </Card>
        </div>

        <div>
          <SectionHeader title="แผนการใช้งาน" />
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13.5px] font-bold text-ink">แผน {appUser.plan}</p>
                <p className="text-[11.5px] text-ink/50">อัปเกรดเพื่อปลดล็อกฟีเจอร์ขั้นสูง</p>
              </div>
              <button
                onClick={() => showToast("นี่คือ Prototype สำหรับนำเสนอ — ยังไม่เปิดชำระเงินจริง")}
                className="rounded-xl bg-[#3A2E0B] px-3.5 py-2 text-[12px] font-bold text-[#F0C419]"
              >
                ★ อัปเกรด
              </button>
            </div>
          </Card>
        </div>

        <PrimaryButton onClick={openEdit}>แก้ไขข้อมูลส่วนตัว</PrimaryButton>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)}>
        <h2 className="mb-3 text-[16px] font-bold text-ink">แก้ไขข้อมูลส่วนตัว</h2>
        <div className="space-y-3">
          <FormField label="ชื่อ-นามสกุล" value={name} onChange={setName} />
          <FormField label="อีเมล" value={email} onChange={setEmail} />
          <FormField label="เบอร์โทรศัพท์" value={phone} onChange={setPhone} />
          <PrimaryButton onClick={save}>บันทึก</PrimaryButton>
          <SecondaryButton onClick={() => setEditing(false)}>ยกเลิก</SecondaryButton>
        </div>
      </Modal>
    </div>
  );
}
