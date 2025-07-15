using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillBank.Migrations
{
    /// <inheritdoc />
    public partial class AddExperienceAndHidden : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ExperienceInYears",
                table: "UserSkills",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<bool>(
                name: "Hidden",
                table: "UserSkills",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExperienceInYears",
                table: "UserSkills");

            migrationBuilder.DropColumn(
                name: "Hidden",
                table: "UserSkills");
        }
    }
}
