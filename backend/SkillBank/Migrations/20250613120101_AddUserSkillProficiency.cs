using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillBank.Migrations
{
    /// <inheritdoc />
    public partial class AddUserSkillProficiency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Proficiency",
                table: "UserSkills",
                type: "integer",
                nullable: false,
                defaultValue: 3);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Proficiency",
                table: "UserSkills");
        }
    }
}
