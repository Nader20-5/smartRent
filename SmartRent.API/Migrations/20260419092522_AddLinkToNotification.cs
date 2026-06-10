using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmartRent.API.Migrations
{
    /// <inheritdoc />
    public partial class AddLinkToNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "RentalApplications");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "RentalApplications",
                newName: "MoveInDate");

            migrationBuilder.RenameColumn(
                name: "MonthlyPrice",
                table: "RentalApplications",
                newName: "ProposedRent");

            migrationBuilder.AddColumn<string>(
                name: "CoverLetter",
                table: "RentalApplications",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LeaseEndDate",
                table: "RentalApplications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverLetter",
                table: "RentalApplications");

            migrationBuilder.DropColumn(
                name: "LeaseEndDate",
                table: "RentalApplications");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "ProposedRent",
                table: "RentalApplications",
                newName: "MonthlyPrice");

            migrationBuilder.RenameColumn(
                name: "MoveInDate",
                table: "RentalApplications",
                newName: "StartDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "RentalApplications",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "IsApproved", "Password", "PhoneNumber", "ProfileImage", "Role" },
                values: new object[,]
                {
                    { 100, new DateTime(2026, 4, 1, 2, 0, 0, 0, DateTimeKind.Local), "tenant@test.com", "Alex Tenant", true, true, "hashed_pw", null, null, "Tenant" },
                    { 101, new DateTime(2026, 4, 1, 2, 0, 0, 0, DateTimeKind.Local), "landlord@test.com", "Sarah Landlord", true, true, "hashed_pw", null, null, "Landlord" },
                    { 102, new DateTime(2026, 4, 1, 2, 0, 0, 0, DateTimeKind.Local), "admin@test.com", "Max Admin", true, true, "hashed_pw", null, null, "Admin" }
                });
        }
    }
}
