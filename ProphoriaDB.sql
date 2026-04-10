-- ============================================================
-- SmartRent Database Script
-- SQL Server 2022
-- ============================================================
-- الخطوات:
-- 1. افتح SSMS
-- 2. اتأكد إنك متوصل بالـ SQL Server
-- 3. اضغط على New Query
-- 4. الصق الكود ده كله
-- 5. اضغط F5 أو Execute
-- ============================================================


-- ============================================================
-- خطوة 1: إنشاء الـ Database
-- ============================================================

-- لو الـ Database موجودة قبل كده، امسحها وابدأ من أول
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'ProphoriaDB')
BEGIN
    -- قطع كل الاتصالات الموجودة على الـ Database
    ALTER DATABASE ProphoriaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ProphoriaDB;
    PRINT '✓ Old Database dropped successfully';
END

-- إنشاء الـ Database الجديدة
CREATE DATABASE ProphoriaDB;
PRINT '✓ ProphoriaDB created successfully';
GO

-- اشتغل على الـ Database دي
USE ProphoriaDB;
GO

PRINT '==========================================';
PRINT 'Starting Prophoria Database Setup...';
PRINT '==========================================';


-- ============================================================
-- جدول 1: Users
-- ============================================================

CREATE TABLE Users (
    Id           INT           PRIMARY KEY IDENTITY(1,1),
    FullName     NVARCHAR(100) NOT NULL,
    Email        NVARCHAR(100) NOT NULL,
    Password     NVARCHAR(255) NOT NULL,
    PhoneNumber  NVARCHAR(20)  NULL,
    Role         NVARCHAR(20)  NOT NULL,
    IsApproved   BIT           NOT NULL DEFAULT 0,
    ProfileImage NVARCHAR(500) NULL,
    IsActive     BIT           NOT NULL DEFAULT 1,
    CreatedAt    DATETIME2     NOT NULL DEFAULT GETDATE(),

    -- Email مينفعش يتكرر
    CONSTRAINT UQ_Users_Email
        UNIQUE (Email),

    -- Role لازم يكون واحد من التلاتة دول بس
    CONSTRAINT CHK_Users_Role
        CHECK (Role IN ('Admin', 'Landlord', 'Tenant'))
);

PRINT '✓ Table Users created';


-- ============================================================
-- جدول 2: Properties
-- ============================================================

CREATE TABLE Properties (
    Id           INT           PRIMARY KEY IDENTITY(1,1),
    Title        NVARCHAR(150) NOT NULL,
    Description  NVARCHAR(MAX) NULL,
    Price        DECIMAL(10,2) NOT NULL,
    Location     NVARCHAR(200) NOT NULL,
    PropertyType NVARCHAR(50)  NOT NULL,
    RentalStatus NVARCHAR(20)  NOT NULL DEFAULT 'Available',
    IsApproved   BIT           NOT NULL DEFAULT 0,
    IsActive     BIT           NOT NULL DEFAULT 1,
    LandlordId   INT           NOT NULL,
    CreatedAt    DATETIME2     NOT NULL DEFAULT GETDATE(),
    UpdatedAt    DATETIME2     NULL,

    -- PropertyType لازم يكون من الاختيارات دي
    CONSTRAINT CHK_Properties_Type
        CHECK (PropertyType IN ('Apartment', 'Villa', 'Studio', 'Office')),

    -- RentalStatus لازم يكون من الاختيارات دي
    CONSTRAINT CHK_Properties_Status
        CHECK (RentalStatus IN ('Available', 'Rented', 'Pending')),

    -- السعر لازم يكون أكبر من صفر
    CONSTRAINT CHK_Properties_Price
        CHECK (Price > 0),

    -- FK: LandlordId → Users
    CONSTRAINT FK_Properties_Users
        FOREIGN KEY (LandlordId)
        REFERENCES Users(Id)
);

PRINT '✓ Table Properties created';


-- ============================================================
-- جدول 3: PropertyImages
-- ============================================================

CREATE TABLE PropertyImages (
    Id         INT           PRIMARY KEY IDENTITY(1,1),
    PropertyId INT           NOT NULL,
    ImageUrl   NVARCHAR(500) NOT NULL,
    IsMain     BIT           NOT NULL DEFAULT 0,
    CreatedAt  DATETIME2     NOT NULL DEFAULT GETDATE(),

    -- FK: PropertyId → Properties
    -- ON DELETE CASCADE = لو العقار اتمسح، الصور تتمسح أوتوماتيك
    CONSTRAINT FK_PropertyImages_Properties
        FOREIGN KEY (PropertyId)
        REFERENCES Properties(Id)
        ON DELETE CASCADE
);

PRINT '✓ Table PropertyImages created';


-- ============================================================
-- جدول 4: PropertyAmenities
-- ============================================================

CREATE TABLE PropertyAmenities (
    Id          INT  PRIMARY KEY IDENTITY(1,1),
    PropertyId  INT  NOT NULL,
    HasParking  BIT  NOT NULL DEFAULT 0,
    HasElevator BIT  NOT NULL DEFAULT 0,
    IsFurnished BIT  NOT NULL DEFAULT 0,
    HasPool     BIT  NOT NULL DEFAULT 0,

    -- UNIQUE: كل عقار له صف واحد بس هنا
    CONSTRAINT UQ_PropertyAmenities_PropertyId
        UNIQUE (PropertyId),

    -- FK: PropertyId → Properties
    CONSTRAINT FK_PropertyAmenities_Properties
        FOREIGN KEY (PropertyId)
        REFERENCES Properties(Id)
        ON DELETE CASCADE
);

PRINT '✓ Table PropertyAmenities created';


-- ============================================================
-- جدول 5: VisitRequests
-- ============================================================

CREATE TABLE VisitRequests (
    Id            INT           PRIMARY KEY IDENTITY(1,1),
    PropertyId    INT           NOT NULL,
    TenantId      INT           NOT NULL,
    RequestedDate DATETIME2     NOT NULL,
    Message       NVARCHAR(500) NULL,
    Status        NVARCHAR(20)  NOT NULL DEFAULT 'Pending',
    LandlordNote  NVARCHAR(500) NULL,
    CreatedAt     DATETIME2     NOT NULL DEFAULT GETDATE(),
    UpdatedAt     DATETIME2     NULL,

    -- Status لازم يكون من الاختيارات دي
    CONSTRAINT CHK_VisitRequests_Status
        CHECK (Status IN ('Pending', 'Accepted', 'Rejected', 'Cancelled')),

    -- FK: PropertyId → Properties
    CONSTRAINT FK_VisitRequests_Properties
        FOREIGN KEY (PropertyId)
        REFERENCES Properties(Id),

    -- FK: TenantId → Users
    CONSTRAINT FK_VisitRequests_Users
        FOREIGN KEY (TenantId)
        REFERENCES Users(Id)
);

PRINT '✓ Table VisitRequests created';


-- ============================================================
-- جدول 6: RentalApplications
-- ============================================================

CREATE TABLE RentalApplications (
    Id              INT           PRIMARY KEY IDENTITY(1,1),
    PropertyId      INT           NOT NULL,
    TenantId        INT           NOT NULL,
    Status          NVARCHAR(20)  NOT NULL DEFAULT 'Pending',
    StartDate       DATETIME2     NOT NULL,
    EndDate         DATETIME2     NOT NULL,
    MonthlyPrice    DECIMAL(10,2) NOT NULL,
    Notes           NVARCHAR(MAX) NULL,
    RejectionReason NVARCHAR(500) NULL,
    CreatedAt       DATETIME2     NOT NULL DEFAULT GETDATE(),
    UpdatedAt       DATETIME2     NULL,

    -- Status لازم يكون من الاختيارات دي
    CONSTRAINT CHK_RentalApplications_Status
        CHECK (Status IN ('Pending', 'Accepted', 'Rejected')),

    -- EndDate لازم تكون بعد StartDate
    CONSTRAINT CHK_RentalApplications_Dates
        CHECK (EndDate > StartDate),

    -- السعر لازم يكون أكبر من صفر
    CONSTRAINT CHK_RentalApplications_Price
        CHECK (MonthlyPrice > 0),

    -- FK: PropertyId → Properties
    CONSTRAINT FK_RentalApplications_Properties
        FOREIGN KEY (PropertyId)
        REFERENCES Properties(Id),

    -- FK: TenantId → Users
    CONSTRAINT FK_RentalApplications_Users
        FOREIGN KEY (TenantId)
        REFERENCES Users(Id)
);

PRINT '✓ Table RentalApplications created';


-- ============================================================
-- جدول 7: ApplicationDocuments
-- ============================================================

CREATE TABLE ApplicationDocuments (
    Id            INT           PRIMARY KEY IDENTITY(1,1),
    ApplicationId INT           NOT NULL,
    DocumentUrl   NVARCHAR(500) NOT NULL,
    DocumentType  NVARCHAR(100) NULL,
    UploadedAt    DATETIME2     NOT NULL DEFAULT GETDATE(),

    -- DocumentType لازم يكون من الاختيارات دي (أو NULL)
    CONSTRAINT CHK_ApplicationDocuments_Type
        CHECK (DocumentType IN ('NationalId', 'SalaryProof', 'BankStatement') OR DocumentType IS NULL),

    -- FK: ApplicationId → RentalApplications
    CONSTRAINT FK_ApplicationDocuments_RentalApplications
        FOREIGN KEY (ApplicationId)
        REFERENCES RentalApplications(Id)
        ON DELETE CASCADE
);

PRINT '✓ Table ApplicationDocuments created';


-- ============================================================
-- جدول 8: Favorites
-- ============================================================

CREATE TABLE Favorites (
    Id         INT       PRIMARY KEY IDENTITY(1,1),
    TenantId   INT       NOT NULL,
    PropertyId INT       NOT NULL,
    CreatedAt  DATETIME2 NOT NULL DEFAULT GETDATE(),

    -- منع التكرار: Tenant مش يضيف نفس العقار مرتين
    CONSTRAINT UQ_Favorites
        UNIQUE (TenantId, PropertyId),

    -- FK: TenantId → Users
    CONSTRAINT FK_Favorites_Users
        FOREIGN KEY (TenantId)
        REFERENCES Users(Id),

    -- FK: PropertyId → Properties
    CONSTRAINT FK_Favorites_Properties
        FOREIGN KEY (PropertyId)
        REFERENCES Properties(Id)
);

PRINT '✓ Table Favorites created';


-- ============================================================
-- جدول 9: Reviews
-- ============================================================

CREATE TABLE Reviews (
    Id         INT           PRIMARY KEY IDENTITY(1,1),
    PropertyId INT           NOT NULL,
    TenantId   INT           NOT NULL,
    Rating     INT           NOT NULL,
    Comment    NVARCHAR(MAX) NULL,
    CreatedAt  DATETIME2     NOT NULL DEFAULT GETDATE(),

    -- Rating لازم يكون من 1 لـ 5 بس
    CONSTRAINT CHK_Reviews_Rating
        CHECK (Rating BETWEEN 1 AND 5),

    -- كل Tenant يعمل Review واحدة بس لكل عقار
    CONSTRAINT UQ_Reviews
        UNIQUE (TenantId, PropertyId),

    -- FK: PropertyId → Properties
    CONSTRAINT FK_Reviews_Properties
        FOREIGN KEY (PropertyId)
        REFERENCES Properties(Id),

    -- FK: TenantId → Users
    CONSTRAINT FK_Reviews_Users
        FOREIGN KEY (TenantId)
        REFERENCES Users(Id)
);

PRINT '✓ Table Reviews created';


-- ============================================================
-- جدول 10: Notifications
-- ============================================================

CREATE TABLE Notifications (
    Id        INT           PRIMARY KEY IDENTITY(1,1),
    UserId    INT           NOT NULL,
    Title     NVARCHAR(100) NOT NULL,
    Message   NVARCHAR(500) NOT NULL,
    Type      NVARCHAR(50)  NOT NULL,
    IsRead    BIT           NOT NULL DEFAULT 0,
    RelatedId INT           NULL,
    CreatedAt DATETIME2     NOT NULL DEFAULT GETDATE(),

    -- Type لازم يكون من الاختيارات دي
    CONSTRAINT CHK_Notifications_Type
        CHECK (Type IN (
            'VisitRequest',
            'VisitAccepted',
            'VisitRejected',
            'ApplicationAccepted',
            'ApplicationRejected',
            'PropertyApproved',
            'PropertyRejected',
            'AccountApproved',
            'AccountRejected'
        )),

    -- FK: UserId → Users
    CONSTRAINT FK_Notifications_Users
        FOREIGN KEY (UserId)
        REFERENCES Users(Id)
);

PRINT '✓ Table Notifications created';


-- ============================================================
-- Indexes - تحسين أداء البحث
-- ============================================================

-- البحث بالموقع
CREATE INDEX IX_Properties_Location
    ON Properties(Location);

-- الفلترة بالسعر
CREATE INDEX IX_Properties_Price
    ON Properties(Price);

-- الفلترة بالنوع
CREATE INDEX IX_Properties_Type
    ON Properties(PropertyType);

-- الفلترة بحالة الإيجار
CREATE INDEX IX_Properties_RentalStatus
    ON Properties(RentalStatus);

-- جيب العقارات المعتمدة بس
CREATE INDEX IX_Properties_IsApproved
    ON Properties(IsApproved);

-- جيب عقارات Landlord معين
CREATE INDEX IX_Properties_LandlordId
    ON Properties(LandlordId);

-- جيب إشعارات مستخدم معين
CREATE INDEX IX_Notifications_UserId
    ON Notifications(UserId);

-- جيب الإشعارات الغير مقروءة
CREATE INDEX IX_Notifications_IsRead
    ON Notifications(IsRead);

-- جيب طلبات زيارة عقار معين
CREATE INDEX IX_VisitRequests_PropertyId
    ON VisitRequests(PropertyId);

-- جيب طلبات إيجار عقار معين
CREATE INDEX IX_RentalApplications_PropertyId
    ON RentalApplications(PropertyId);

PRINT '✓ All Indexes created';


-- ============================================================
-- Admin Account
-- ============================================================

-- بنضيف Admin واحد - الـ Password هيتغير من الـ Backend
INSERT INTO Users (FullName, Email, Password, Role, IsApproved, IsActive)
VALUES ('Admin', 'admin@smartrent.com', 'CHANGE_FROM_BACKEND', 'Admin', 1, 1);

PRINT '✓ Admin account created';


-- ============================================================
-- تأكيد: عرض الجداول اللي اتعملت
-- ============================================================

PRINT '';
PRINT '==========================================';
PRINT 'SmartRent Database Setup COMPLETE!';
PRINT '==========================================';
PRINT '';

SELECT
    TABLE_NAME  AS [Table],
    (
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS c
        WHERE c.TABLE_NAME = t.TABLE_NAME
    )           AS [Columns Count]
FROM INFORMATION_SCHEMA.TABLES t
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;