using Microsoft.EntityFrameworkCore;
using SkillBank.Entities;
using SkillBank.Models;

namespace SkillBank.Services;

public class UserService(ApplicationDbContext context)
{
    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var entity = await context.Users
            .Include(x => x.Skills)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
        {
            return null;
        }
        var skills = entity.Skills
            .Select(x => new UserSkillDto(x.Label))
            .ToList();
        return new UserDto(entity.Id, entity.UserName!, skills);
    }
}
