using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillBank.Migrations
{
    /// <inheritdoc />
    public partial class AddRefeshTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "RefreshTokenId",
                table: "AspNetUsers",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshTokenId",
                table: "AspNetUsers");
        }
    }
}
