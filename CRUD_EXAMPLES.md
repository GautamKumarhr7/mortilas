# CRUD Example Bodies

This file collects example create request bodies for the CRUD APIs added today.

## 1. Client

```json
{
  "name": "ABC Builders Pvt Ltd",
  "address": "12 Park Street, Kolkata, West Bengal",
  "gstinno": "19ABCDE1234F1Z5",
  "panno": "ABCDE1234F",
  "email": "accounts@abcbuilders.com",
  "phone": "9876543210"
}
```

## 2. Inventory

```json
{
  "itemName": "Copper Cable 4 Core",
  "category": "Electrical",
  "warehouseLocation": "Warehouse A - Rack 3",
  "hsn": "8544",
  "quantity": 150,
  "unit": "mtr",
  "price": 82.5,
  "status": "in stock"
}
```

## 3. Material Indent Item

```json
{
  "indentId": 101,
  "itemId": 55,
  "workOrderId": 12,
  "requiredQty": 25,
  "availableQty": 10,
  "shortageQty": 15,
  "procurementRequired": true,
  "status": "pending"
}
```

## 4. Project

`projectCode` is optional. If omitted, the backend generates a value like `MECPL-ELEC-2025-001`.

```json
{
  "name": "Airport Lighting Upgrade",
  "clientId": 1,
  "category": "Electrical",
  "siteAddress": "Airport Road, Chennai",
  "latitude": 13.08268,
  "longitude": 80.270721,
  "estimatedCost": 2500000,
  "contractValue": 2750000,
  "plannedStart": "2026-08-01",
  "plannedEnd": "2026-12-31",
  "actualStart": "2026-08-05",
  "actualEnd": null,
  "process": "Execution",
  "status": "Draft",
  "notes": "Geo-fenced site for attendance"
}
```

## 5. Subcontractor

`subcontractorCode` is optional. If omitted, the backend generates a value like `SUB0001`.

```json
{
  "companyName": "Delta Civil Works",
  "trade": "Civil",
  "contactPerson": "Rajesh Kumar",
  "email": "rajesh@deltacivil.com",
  "phone": "9000000001",
  "alternatePhone": "9000000002",
  "address": "45 Industrial Estate",
  "city": "Chennai",
  "state": "Tamil Nadu",
  "country": "India",
  "pincode": "600001",
  "gstNo": "33ABCDE1234F1Z1",
  "panNo": "ABCDE1234F",
  "aadhaarNo": "",
  "labourLicenseNo": "LL-78945",
  "electricalLicenseNo": "",
  "epfNo": "EPF1234567",
  "esiNo": "ESI1234567",
  "bankName": "State Bank of India",
  "accountHolder": "Delta Civil Works",
  "accountNumber": "123456789012",
  "ifscCode": "SBIN0000123",
  "tdsType": "Company",
  "tdsRate": 2,
  "defaultRetentionPercent": 5,
  "performanceRating": 4.5,
  "blacklistReason": null,
  "status": "Active",
  "remarks": "Preferred for civil works"
}
```

## 6. Subcontractor Rate Contract

```json
{
  "subcontractorId": "b3b2e0a0-0c1d-4df2-9f6c-2e8d1f2d6b11",
  "boqItemId": 22,
  "agreedRate": 1450,
  "validFrom": "2026-08-01",
  "validTo": "2027-07-31",
  "revisionNo": 1,
  "status": "active"
}
```

## 7. Vendor

`vendorCode` is optional. If omitted, the backend generates a value like `VEN0001`.

```json
{
  "companyName": "Prime Electricals",
  "vendorType": "Material",
  "contactPerson": "Anita Sharma",
  "email": "sales@primeelectricals.com",
  "phone": "9888888888",
  "alternatePhone": "9777777777",
  "address": "99 Market Road",
  "city": "Bengaluru",
  "state": "Karnataka",
  "country": "India",
  "pincode": "560001",
  "gstNo": "29ABCDE1234F1Z2",
  "panNo": "ABCDE1234F",
  "msmeNo": "MSME123456",
  "electricalLicense": "EL-7788",
  "epfNo": "EPF778899",
  "esiNo": "ESI778899",
  "bankName": "HDFC Bank",
  "accountHolder": "Prime Electricals",
  "accountNumber": "987654321098",
  "ifscCode": "HDFC0001234",
  "paymentTermsId": "f2b1a9d0-4e23-4d88-b6c7-9d5c8e2c1111",
  "creditLimit": 500000,
  "rating": 4.8,
  "isPreferred": true,
  "status": "Active",
  "remarks": "Handles bulk electrical supply"
}
```

## 8. Vendor Rate Contract

```json
{
  "vendorId": "d7b5c5d0-9f84-4a31-bb91-1c3d0c5a7a22",
  "itemId": 18,
  "agreedRate": 820,
  "validFrom": "2026-08-01",
  "validTo": "2027-03-31",
  "gst": 18,
  "status": "active"
}
```

## 9. Work Order

`workOrderNo` is optional. If omitted, the backend generates a value like `WO-00012`.

```json
{
  "projectId": 3,
  "title": "Foundation Steel Work",
  "description": "Fabrication and installation of foundation steel",
  "subcontractorId": 2,
  "estimatedCost": 850000,
  "startDate": "2026-08-10",
  "endDate": "2026-09-15",
  "progress": 0,
  "status": "pending",
  "approvedBy": 1
}
```

## 10. Employee (User with type 'employee')

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "securepassword123",
  "type": "employee",
  "dob": "1990-05-15",
  "departmentId": 2,
  "designationId": 4,
  "employeeCode": "EP-0042",
  "dateOfJoining": "2026-08-01",
  "employmentType": "permanent",
  "pan": "ABCDE1234F",
  "addhar": "123456789012",
  "uanNumber": "100904319556",
  "basicPay": 18000,
  "pfApplicable": true,
  "esiApplicable": true,
  "tdsApplicable": 0
}
```

## 11. Attendance

```json
{
  "employeeId": 5,
  "date": "2026-08-01",
  "punchTime": "09:05:00",
  "punchType": "in",
  "attendanceType": "biometric",
  "status": "ontime"
}
```

## 12. Leave Request

```json
{
  "employeeId": 5,
  "type": "CL",
  "title": "Personal emergency",
  "description": "Need a day off for family matters.",
  "fromDate": "2026-08-12",
  "toDate": "2026-08-12"
}
```

## 13. Payroll Generation

**Endpoint**: `POST /api/payrolls/generate`

```json
{
  "employeeId": 5,
  "payMonth": 8,
  "payYear": 2026,
  "payDate": "2026-08-31",
  "advanceLoanRecovery": 1000,
  "professionalTax": 200,
  "remarks": "August 2026 Payroll"
}
```

## 14. Reimbursement

```json
{
  "employeeId": 5,
  "type": "travel",
  "title": "Client Site Visit",
  "description": "Cab fare to and from airport site.",
  "amount": 1500,
  "billAttachment": "/uploads/receipts/cab-fare-aug.pdf"
}
```

## 15. Job Post

```json
{
  "postedBy": 1,
  "title": "Senior Electrical Engineer",
  "description": "Looking for an experienced engineer to oversee site operations.",
  "departmentId": 2,
  "designationId": 3,
  "employmentType": "permanent",
  "vacancies": 2,
  "lastDate": "2026-09-15"
}
```

## 16. Applicant Application

```json
{
  "jobPostId": 4,
  "name": "Alex Smith",
  "email": "alex.smith@example.com",
  "phone": "9876543210",
  "resumeUrl": "/uploads/resumes/alex-smith.pdf"
}
```

## 17. Applicant Onboarding

**Endpoint**: `PATCH /api/applicants/:id/onboard`

```json
{
  "dob": "1992-10-20",
  "joiningDate": "2026-09-01",
  "basicPay": 25000,
  "employeeCode": "EP-0088",
  "documentPath": "/uploads/onboarding/alex-smith.zip"
}
```

## Notes

- Example IDs are placeholders and should be replaced with real database IDs.
- Fields such as `projectCode`, `workOrderNo`, `vendorCode`, and `subcontractorCode` can be omitted when creating new records because the backend generates them.
- The status value for inventory is currently stored as `in stock`, `stortage`, or `out of stock`.
