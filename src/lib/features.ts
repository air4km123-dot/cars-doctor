import type { FeatureMeta } from "./types";

// Central feature registry — every feature from the product spec lives here with
// a status badge (FREE / PREMIUM / COMING_SOON / MARKETPLACE), an optional NEW IDEA
// flag, and a lifecycle stage used by the Product Map. Screens without a bespoke
// route render through /feature/[id] using this metadata.
export const features: FeatureMeta[] = [
  // ---------------- BIRTH (เกิด) ----------------
  { id: "vehicle-profile", title: "ข้อมูลรถ", englishTitle: "Vehicle Profile", description: "ข้อมูลพื้นฐานของรถทั้งหมดในที่เดียว", status: "FREE", stage: "birth", category: "profile", icon: "🚗", route: "/my-car" },
  { id: "vin-record", title: "เลขตัวถัง (VIN)", englishTitle: "VIN / Chassis Record", description: "บันทึกเลขตัวถังและเลขเครื่องยนต์ของรถ", status: "FREE", stage: "birth", category: "profile", icon: "🔢", route: "/feature/vin-record" },
  { id: "purchase-info", title: "ข้อมูลการซื้อ", englishTitle: "Purchase Date / Price", description: "วันที่ซื้อและราคาซื้อขายตั้งต้น", status: "FREE", stage: "birth", category: "profile", icon: "🧾", route: "/feature/purchase-info" },
  { id: "warranty-tracker", title: "ติดตามประกันศูนย์ (Warranty)", englishTitle: "Warranty Tracker", description: "ระยะเวลา/ระยะทางคงเหลือของการรับประกันศูนย์", status: "FREE", stage: "birth", category: "profile", icon: "🛡️", route: "/feature/warranty-tracker" },
  { id: "finance-basic", title: "ข้อมูลไฟแนนซ์เบื้องต้น", englishTitle: "Finance Basic Record", description: "วงเงินกู้ ค่างวด และยอดคงเหลือ", status: "FREE", stage: "birth", category: "profile", icon: "💳", route: "/feature/finance-basic" },
  { id: "loan-calculator", title: "คำนวณเงินดาวน์ / ผ่อน", englishTitle: "Down Payment / Loan Calculator", description: "เครื่องมือคำนวณค่างวดรายเดือนคร่าวๆ", status: "FREE", stage: "birth", category: "profile", icon: "🧮", route: "/feature/loan-calculator" },
  { id: "finance-forecast", title: "วิเคราะห์แนวโน้มไฟแนนซ์", englishTitle: "Finance Forecast & Analysis", description: "คาดการณ์ภาระหนี้และดอกเบี้ยในอนาคต", status: "PREMIUM", stage: "birth", category: "profile", icon: "📈", route: "/feature/finance-forecast" },
  { id: "insurance-record", title: "ข้อมูลประกันภัย", englishTitle: "Insurance Record", description: "บริษัทประกัน ประเภทกรมธรรม์ และวันหมดอายุ", status: "FREE", stage: "birth", category: "legal", icon: "🛡️", route: "/feature/insurance-record" },
  { id: "compulsory-insurance-record", title: "ข้อมูล พ.ร.บ.", englishTitle: "Compulsory Insurance Record", description: "วันคุ้มครองและวันหมดอายุ พ.ร.บ.", status: "FREE", stage: "birth", category: "legal", icon: "📄", route: "/feature/compulsory-insurance-record" },
  { id: "registration-record", title: "ข้อมูลทะเบียนรถ", englishTitle: "Registration Record", description: "เลขทะเบียน จังหวัด และวันจดทะเบียน", status: "FREE", stage: "birth", category: "profile", icon: "🆔", route: "/feature/registration-record" },
  { id: "driver-profile", title: "โปรไฟล์ผู้ขับ / ใบขับขี่", englishTitle: "Driver Profile", description: "เก็บข้อมูลใบขับขี่และแจ้งเตือนก่อนหมดอายุ", status: "FREE", newIdea: true, stage: "birth", category: "profile", icon: "🧑‍✈️", route: "/feature/driver-profile" },
  { id: "wallet", title: "กระเป๋าเอกสารรถ", englishTitle: "Digital Car Wallet", description: "รวมเอกสารสำคัญของรถทั้งหมดไว้ที่เดียว", status: "FREE", stage: "birth", category: "wallet", icon: "🗂️", route: "/my-car/wallet" },
  { id: "ocr", title: "สแกนเอกสารอัตโนมัติ (OCR)", englishTitle: "OCR / Scan Document", description: "ถ่ายรูปเอกสารแล้วให้ระบบอ่านข้อมูลให้อัตโนมัติ", status: "FREE", newIdea: true, stage: "birth", category: "wallet", icon: "📷", route: "/my-car/wallet" },

  // ---------------- LIFE (ใช้ชีวิต) ----------------
  { id: "odometer", title: "เลขไมล์", englishTitle: "Odometer / Mileage", description: "บันทึกและติดตามเลขไมล์ปัจจุบัน", status: "FREE", stage: "life", category: "maintenance", icon: "📍", route: "/my-car" },
  { id: "maintenance-history", title: "ประวัติการบำรุงรักษา", englishTitle: "Maintenance History", description: "ประวัติซ่อมบำรุงทุกรายการแยกตามหมวด", status: "FREE", stage: "life", category: "maintenance", icon: "🧰", route: "/maintenance" },
  { id: "oil-tracker", title: "น้ำมันเครื่อง", englishTitle: "Oil Change Tracker", description: "ติดตามรอบเปลี่ยนถ่ายน้ำมันเครื่อง", status: "FREE", stage: "life", category: "maintenance", icon: "🛢️", route: "/tracker/oil" },
  { id: "battery-tracker", title: "แบตเตอรี่", englishTitle: "Battery Tracker", description: "ติดตามอายุและรอบตรวจแบตเตอรี่", status: "FREE", stage: "life", category: "maintenance", icon: "🔋", route: "/tracker/battery" },
  { id: "tire-tracker", title: "ยาง", englishTitle: "Tire Tracker", description: "ติดตามการสลับยางและอายุยาง", status: "FREE", stage: "life", category: "maintenance", icon: "🛞", route: "/tracker/tire" },
  { id: "brake-tracker", title: "เบรก", englishTitle: "Brake Tracker", description: "ประวัติตรวจเบรกและสถานะล่าสุด", status: "FREE", stage: "life", category: "maintenance", icon: "🛑", route: "/tracker/brake" },
  { id: "aircon-tracker", title: "ระบบแอร์", englishTitle: "Air Conditioning Tracker", description: "ติดตามรอบล้างแอร์และเติมน้ำยา", status: "FREE", stage: "life", category: "maintenance", icon: "❄️", route: "/tracker/aircon" },
  { id: "injector-tracker", title: "หัวฉีด", englishTitle: "Injector Tracker", description: "ติดตามรอบล้างหัวฉีด", status: "FREE", stage: "life", category: "maintenance", icon: "💉", route: "/tracker/injector" },
  { id: "reminders", title: "การแจ้งเตือน", englishTitle: "Reminder", description: "แจ้งเตือนตามวันที่ ระยะทาง หรือแบบประจำ", status: "FREE", stage: "life", category: "maintenance", icon: "🔔", route: "/reminders" },
  { id: "legal-calendar", title: "ปฏิทินเอกสารรถ", englishTitle: "Car Legal Calendar", description: "รวมวันสำคัญด้านกฎหมายของรถไว้ในปฏิทินเดียว", status: "FREE", stage: "life", category: "legal", icon: "📅", route: "/legal-calendar" },
  { id: "road-tax", title: "ภาษีรถยนต์", englishTitle: "Road Tax", description: "แจ้งเตือนวันต่อภาษีประจำปี", status: "FREE", stage: "life", category: "legal", icon: "🏷️", route: "/feature/road-tax" },
  { id: "inspection", title: "ตรวจสภาพรถ (ตรอ.)", englishTitle: "Inspection", description: "แจ้งเตือนเมื่อถึงรอบต้องตรวจสภาพ", status: "FREE", stage: "life", category: "legal", icon: "🔍", route: "/feature/inspection" },
  { id: "insurance", title: "ประกันภัยรถยนต์", englishTitle: "Insurance", description: "รายละเอียดกรมธรรม์และแจ้งเตือนต่ออายุ", status: "FREE", stage: "life", category: "legal", icon: "🛡️", route: "/feature/insurance" },
  { id: "compulsory-insurance", title: "พ.ร.บ.", englishTitle: "Compulsory Insurance", description: "แจ้งเตือนวันหมดอายุ พ.ร.บ.", status: "FREE", stage: "life", category: "legal", icon: "📄", route: "/feature/compulsory-insurance" },
  { id: "fuel-tracker", title: "บันทึกการเติมน้ำมัน", englishTitle: "Fuel Tracker", description: "บันทึกวันที่ ราคา ปริมาณ และเลขไมล์ทุกครั้งที่เติม", status: "FREE", stage: "life", category: "fuel", icon: "⛽", route: "/fuel" },
  { id: "fuel-dashboard", title: "แดชบอร์ดน้ำมัน", englishTitle: "Fuel Dashboard", description: "สรุปอัตราสิ้นเปลืองและค่าใช้จ่ายน้ำมัน", status: "FREE", stage: "life", category: "fuel", icon: "📊", route: "/fuel" },
  { id: "expense-tracking", title: "บันทึกค่าใช้จ่าย", englishTitle: "Expense Tracking", description: "บันทึกค่าใช้จ่ายทุกหมวดของรถ", status: "FREE", stage: "life", category: "expense", icon: "💸", route: "/expenses" },
  { id: "expense-dashboard", title: "แดชบอร์ดค่าใช้จ่าย", englishTitle: "Expense Dashboard", description: "สรุปค่าใช้จ่ายรายเดือน/รายปีและแนวโน้ม", status: "FREE", stage: "life", category: "expense", icon: "📈", route: "/expenses" },
  { id: "useful-today", title: "วันนี้มีอะไรน่ารู้", englishTitle: "Useful Today", description: "ข้อมูลที่เป็นประโยชน์ประจำวันสำหรับคนขับรถ", status: "FREE", newIdea: true, stage: "life", category: "home", icon: "💡", route: "/feature/useful-today" },
  { id: "fuel-price-today", title: "ราคาน้ำมันวันนี้", englishTitle: "Fuel Price Today", description: "ราคาน้ำมันแต่ละประเภทอัปเดตรายวัน", status: "FREE", newIdea: true, stage: "life", category: "home", icon: "⛽", route: "/feature/fuel-price-today" },
  { id: "traffic-fine", title: "ตรวจสอบใบสั่ง", englishTitle: "Traffic Fine", description: "ตรวจสอบใบสั่งค้างชำระของรถคันนี้", status: "FREE", newIdea: true, stage: "life", category: "legal", icon: "🚓", route: "/feature/traffic-fine" },
  { id: "pretrip-check", title: "เช็กก่อนออกเดินทาง", englishTitle: "Pre-trip Check", description: "เช็กลิสต์ความพร้อมของรถก่อนเดินทางไกล", status: "FREE", newIdea: true, stage: "life", category: "maintenance", icon: "✅", route: "/feature/pretrip-check" },
  { id: "emergency-contacts", title: "เบอร์ฉุกเฉิน", englishTitle: "Emergency Contacts", description: "รวมเบอร์ติดต่อฉุกเฉินที่เกี่ยวกับรถ", status: "FREE", newIdea: true, stage: "life", category: "emergency", icon: "🚨", route: "/feature/emergency-contacts" },
  { id: "voice-input", title: "พูดเพื่อบันทึกข้อมูล", englishTitle: "Voice Input", description: "พูดสรุปสิ่งที่ทำวันนี้ ระบบแปลงเป็นข้อมูลให้อัตโนมัติ", status: "FREE", newIdea: true, stage: "life", category: "input", icon: "🎤", route: "/feature/voice-input" },

  // ---------------- SICK (เจ็บ) ----------------
  { id: "health-score", title: "คะแนนสุขภาพรถ", englishTitle: "Car Health Score", description: "ภาพรวมสุขภาพรถทุกระบบในคะแนนเดียว", status: "FREE", stage: "sick", category: "health", icon: "🩺", route: "/doctor/health" },
  { id: "health-basic", title: "คะแนนสุขภาพเบื้องต้น", englishTitle: "Basic Car Health Score", description: "คำนวณจากประวัติซ่อมบำรุง เลขไมล์ และเอกสาร", status: "FREE", stage: "sick", category: "health", icon: "🩺", route: "/doctor/health" },
  { id: "health-advanced", title: "วิเคราะห์สุขภาพรถขั้นสูง", englishTitle: "Advanced Car Health Score", description: "วิเคราะห์พฤติกรรมการใช้งานและความเสี่ยงเชิงลึก", status: "PREMIUM", stage: "sick", category: "health", icon: "🩺", route: "/feature/health-advanced" },
  { id: "symptom-record", title: "บันทึกอาการรถ", englishTitle: "Symptom Record", description: "บันทึกอาการผิดปกติพร้อมรูปและเสียง", status: "FREE", stage: "sick", category: "health", icon: "📝", route: "/feature/symptom-record" },
  { id: "ai-doctor-basic", title: "หมอรถ AI (เบื้องต้น)", englishTitle: "Basic AI Cars Doctor", description: "ถามอาการรถ รับคำแนะนำเบื้องต้นฟรี", status: "FREE", stage: "sick", category: "ai", icon: "🤖", route: "/doctor/ai" },
  { id: "ai-doctor-full", title: "หมอรถ AI (เต็มรูปแบบ)", englishTitle: "Full AI Cars Doctor", description: "วิเคราะห์เจาะลึกโดยอ้างอิงประวัติรถของคุณ", status: "PREMIUM", stage: "sick", category: "ai", icon: "🤖", route: "/doctor/ai/full" },
  { id: "issue-severity", title: "ระดับความรุนแรงของอาการ", englishTitle: "Issue Severity", description: "จัดระดับอาการเป็น ต่ำ/กลาง/สูง/ด่วน", status: "FREE", stage: "sick", category: "ai", icon: "🚦", route: "/doctor/ai" },
  { id: "ai-image-analysis", title: "วิเคราะห์รูปภาพด้วย AI", englishTitle: "AI Image Analysis", description: "อัปโหลดรูปอาการเสีย ให้ AI ช่วยวิเคราะห์", status: "PREMIUM", stage: "sick", category: "ai", icon: "📸", route: "/feature/ai-image-analysis" },
  { id: "ai-sound-analysis", title: "วิเคราะห์เสียงด้วย AI", englishTitle: "AI Sound Analysis", description: "อัดเสียงผิดปกติ ให้ AI ช่วยวิเคราะห์", status: "PREMIUM", stage: "sick", category: "ai", icon: "🎙️", route: "/feature/ai-sound-analysis" },
  { id: "predictive-maintenance", title: "คาดการณ์การซ่อมบำรุง", englishTitle: "Predictive Maintenance", description: "คาดการณ์รอบซ่อมบำรุงล่วงหน้าจากพฤติกรรมการใช้งาน", status: "PREMIUM", stage: "sick", category: "ai", icon: "🔮", route: "/feature/predictive-maintenance" },
  { id: "repair-cost-estimate", title: "ประเมินค่าซ่อม", englishTitle: "Repair Cost Estimate", description: "ประเมินช่วงราคาค่าซ่อมตามอาการ", status: "PREMIUM", stage: "sick", category: "ai", icon: "💰", route: "/feature/repair-cost-estimate" },
  { id: "service-cost-estimate", title: "ประเมินค่าบริการล่วงหน้า", englishTitle: "Service Cost Estimate", description: "ประเมินราคาค่าบริการตามรุ่นรถและระยะทาง", status: "FREE", newIdea: true, stage: "sick", category: "ai", icon: "🧾", route: "/feature/service-cost-estimate" },
  { id: "accident-record", title: "บันทึกอุบัติเหตุ", englishTitle: "Accident Record", description: "บันทึกวันที่ สถานที่ และรายละเอียดอุบัติเหตุ", status: "FREE", stage: "sick", category: "emergency", icon: "⚠️", route: "/feature/accident-record" },
  { id: "claim-history", title: "ประวัติการเคลม", englishTitle: "Claim History", description: "รวมประวัติการเคลมประกันทั้งหมด", status: "FREE", stage: "sick", category: "emergency", icon: "📋", route: "/feature/claim-history" },
  { id: "claim-assistant", title: "ผู้ช่วยเคลมประกัน", englishTitle: "Claim Assistant", description: "แนะนำขั้นตอนและเอกสารที่ต้องใช้ในการเคลม", status: "PREMIUM", stage: "sick", category: "emergency", icon: "🧑‍💼", route: "/feature/claim-assistant" },
  { id: "roadside-assistance", title: "ช่วยเหลือฉุกเฉินข้างทาง", englishTitle: "Roadside Assistance", description: "เรียกรถลาก แบตพ่วง หรือช่างมาช่วยฉุกเฉิน", status: "MARKETPLACE", stage: "sick", category: "emergency", icon: "🚨", route: "/feature/roadside-assistance" },

  // ---------------- PRE-SELL (ก่อนขาย) ----------------
  { id: "depreciation-preview", title: "ดูค่าเสื่อมราคาโดยประมาณ", englishTitle: "Depreciation Preview", description: "แนวโน้มค่าเสื่อมราคาตั้งแต่วันซื้อ", status: "FREE", stage: "presell", category: "value", icon: "📉", route: "/feature/depreciation-preview" },
  { id: "vehicle-value-today", title: "มูลค่ารถวันนี้", englishTitle: "Vehicle Value Today", description: "ประเมินมูลค่ารถ ณ ปัจจุบัน", status: "PREMIUM", stage: "presell", category: "value", icon: "💵", route: "/feature/vehicle-value-today" },
  { id: "future-value-forecast", title: "คาดการณ์มูลค่าในอนาคต", englishTitle: "Future Value Forecast", description: "คาดการณ์มูลค่ารถใน 1 / 2 / 3 ปีข้างหน้า", status: "PREMIUM", stage: "presell", category: "value", icon: "🔭", route: "/feature/future-value-forecast" },
  { id: "resale-price", title: "ราคาขายต่อปัจจุบัน", englishTitle: "Current Resale Price", description: "ราคาขายต่อโดยประมาณในตลาดปัจจุบัน", status: "PREMIUM", stage: "presell", category: "value", icon: "🏷️", route: "/feature/resale-price" },
  { id: "trade-in-estimate", title: "ประเมินราคา Trade-in", englishTitle: "Trade-in Estimate", description: "ราคาประเมินสำหรับการเทิร์นรถใหม่", status: "PREMIUM", stage: "presell", category: "value", icon: "🔄", route: "/feature/trade-in-estimate" },
  { id: "outstanding-finance", title: "ยอดหนี้คงเหลือ", englishTitle: "Outstanding Finance", description: "ยอดคงเหลือและจำนวนงวดที่เหลือ", status: "FREE", stage: "presell", category: "value", icon: "🏦", route: "/feature/outstanding-finance" },
  { id: "vehicle-equity", title: "ส่วนต่างมูลค่ารถ (Equity)", englishTitle: "Vehicle Equity", description: "มูลค่ารถปัจจุบัน หักด้วยยอดหนี้คงเหลือ", status: "PREMIUM", stage: "presell", category: "value", icon: "⚖️", route: "/feature/vehicle-equity" },
  { id: "keep-vs-sell", title: "วิเคราะห์ เก็บ หรือ ขาย", englishTitle: "Keep vs Sell Analysis", description: "วิเคราะห์ว่าควรเก็บรถไว้ใช้ต่อ หรือขายตอนนี้", status: "PREMIUM", stage: "presell", category: "value", icon: "🤔", route: "/feature/keep-vs-sell" },
  { id: "best-time-to-sell", title: "ช่วงเวลาที่ควรขาย", englishTitle: "Best Time to Sell", description: "แนะนำช่วงเวลาที่เหมาะสมที่สุดในการขายรถ", status: "PREMIUM", stage: "presell", category: "value", icon: "⏰", route: "/feature/best-time-to-sell" },
  { id: "selling-checklist", title: "เช็กลิสต์ก่อนขายรถ", englishTitle: "Selling Checklist", description: "รายการเอกสารและสิ่งที่ต้องเตรียมก่อนขาย", status: "FREE", stage: "presell", category: "sell", icon: "✅", route: "/sell" },
  { id: "buyer-history-summary", title: "สรุปประวัติรถให้ผู้ซื้อ", englishTitle: "Buyer Vehicle History Summary", description: "สรุปประวัติรถแบบอ่านง่ายสำหรับผู้ซื้อ", status: "FREE", stage: "presell", category: "sell", icon: "📑", route: "/feature/buyer-history-summary" },
  { id: "health-report", title: "รายงานสุขภาพรถ", englishTitle: "Car Health Report", description: "รายงานสรุปสุขภาพ ซ่อมบำรุง อุบัติเหตุ และเอกสาร", status: "PREMIUM", stage: "presell", category: "sell", icon: "📊", route: "/feature/health-report" },

  // ---------------- TRANSFER (ส่งต่อ) ----------------
  { id: "transfer-checklist", title: "เช็กลิสต์โอนกรรมสิทธิ์", englishTitle: "Ownership Transfer Checklist", description: "ขั้นตอนและเอกสารสำหรับโอนรถ", status: "FREE", stage: "transfer", category: "sell", icon: "📝", route: "/feature/transfer-checklist" },
  { id: "transfer-vehicle", title: "โอนรถใน Cars Doctor", englishTitle: "Transfer Vehicle in Cars Doctor", description: "ส่งต่อประวัติรถให้เจ้าของใหม่โดยไม่ส่งข้อมูลส่วนตัว", status: "FREE", stage: "transfer", category: "sell", icon: "🔁", route: "/feature/transfer-vehicle" },
  { id: "passport", title: "พาสปอร์ตรถ", englishTitle: "Vehicle Passport", description: "ไทม์ไลน์ประวัติทั้งชีวิตของรถคันนี้", status: "FREE", stage: "transfer", category: "passport", icon: "🛂", route: "/passport" },
  { id: "passport-basic", title: "พาสปอร์ตรถ (พื้นฐาน)", englishTitle: "Vehicle Passport Basic", description: "ไทม์ไลน์หลักของประวัติรถ ใช้งานได้ฟรี", status: "FREE", stage: "transfer", category: "passport", icon: "🛂", route: "/passport" },
  { id: "passport-certified", title: "พาสปอร์ตรถแบบรับรอง", englishTitle: "Certified Vehicle Passport", description: "ประวัติที่ผ่านการตรวจสอบและรับรองความถูกต้อง", status: "COMING_SOON", stage: "transfer", category: "passport", icon: "🏅", route: "/feature/passport-certified" },

  // ---------------- EOL (จบชีวิตรถ) ----------------
  { id: "total-loss-record", title: "บันทึกรถเสียหายสิ้นเชิง", englishTitle: "Total Loss Record", description: "บันทึกกรณีรถเสียหายทั้งคัน (Total Loss)", status: "FREE", stage: "eol", category: "eol", icon: "☠️", route: "/feature/total-loss-record" },
  { id: "eol-checklist", title: "เช็กลิสต์ปิดชีวิตรถ", englishTitle: "End-of-Life Checklist", description: "ขั้นตอนด้านเอกสาร ประกัน ไฟแนนซ์ และทะเบียนเมื่อเลิกใช้รถ", status: "COMING_SOON", stage: "eol", category: "eol", icon: "📋", route: "/feature/eol-checklist" },
  { id: "salvage-marketplace", title: "ตลาดซากรถ / รีไซเคิล", englishTitle: "Salvage / Recycle Marketplace", description: "ค้นหาผู้รับซื้อซากรถหรือชิ้นส่วนรีไซเคิล", status: "MARKETPLACE", stage: "eol", category: "eol", icon: "♻️", route: "/feature/salvage-marketplace" },

  // ---------------- MARKETPLACE (Phase 3) ----------------
  { id: "marketplace", title: "มาร์เก็ตเพลส", englishTitle: "Marketplace", description: "ค้นหาและเปรียบเทียบผู้ให้บริการใกล้คุณ", status: "MARKETPLACE", stage: "marketplace", category: "marketplace", icon: "🌐", route: "/marketplace" },
  { id: "provider-search", title: "ค้นหาผู้ให้บริการ", englishTitle: "Provider Search", description: "ค้นหาร้าน/ศูนย์บริการใกล้ฉันตามประเภทงาน", status: "MARKETPLACE", stage: "marketplace", category: "marketplace", icon: "🔍", route: "/marketplace/providers" },
  { id: "provider-comparison", title: "เปรียบเทียบผู้ให้บริการ", englishTitle: "Provider Comparison", description: "เทียบราคา คะแนน ระยะทาง และความเชี่ยวชาญ", status: "MARKETPLACE", stage: "marketplace", category: "marketplace", icon: "⚖️", route: "/marketplace/providers" },
  { id: "service-booking", title: "จองคิวบริการ", englishTitle: "Service Booking", description: "เลือกวัน เวลา และบริการที่ต้องการ", status: "MARKETPLACE", stage: "marketplace", category: "marketplace", icon: "📆", route: "/feature/service-booking" },
  { id: "availability", title: "ตารางคิวว่าง", englishTitle: "Availability", description: "ดูช่วงเวลาที่ร้านสะดวกให้บริการ", status: "MARKETPLACE", stage: "marketplace", category: "marketplace", icon: "🕐", route: "/feature/availability" },
  { id: "rating-review", title: "คะแนนและรีวิว", englishTitle: "Rating & Review", description: "ดูและให้คะแนนผู้ให้บริการ", status: "MARKETPLACE", stage: "marketplace", category: "marketplace", icon: "⭐", route: "/feature/rating-review" },
  { id: "payment", title: "การชำระเงิน", englishTitle: "Payment", description: "ชำระค่าบริการผ่านแอป", status: "MARKETPLACE", stage: "marketplace", category: "marketplace", icon: "💳", route: "/feature/payment" },
  { id: "insurance-marketplace", title: "เปรียบเทียบ/ซื้อประกัน", englishTitle: "Insurance Compare / Buy", description: "เทียบและซื้อประกันภัยรถยนต์ผ่านพาร์ทเนอร์", status: "MARKETPLACE", stage: "marketplace", category: "marketplace", icon: "🛡️", route: "/feature/insurance-marketplace" },
  { id: "provider-recommendation", title: "แนะนำผู้ให้บริการจากข้อมูลรถ", englishTitle: "Provider Recommendation from Car Data", description: "AI แนะนำผู้ให้บริการที่เหมาะกับรถและอาการของคุณ", status: "MARKETPLACE", newIdea: true, stage: "marketplace", category: "marketplace", icon: "🎯", route: "/feature/provider-recommendation" },
];

export function getFeature(id: string): FeatureMeta | undefined {
  return features.find((f) => f.id === id);
}

export function featuresByStage(stage: FeatureMeta["stage"]): FeatureMeta[] {
  return features.filter((f) => f.stage === stage);
}
