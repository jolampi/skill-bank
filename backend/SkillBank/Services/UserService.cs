using Microsoft.EntityFrameworkCore;
using SkillBank.Entities;
using SkillBank.Models;

namespace SkillBank.Services;

public class UserService(ApplicationDbContext context)
{
    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var entity = await context.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
        {
            return null;
        }
        return new UserDto(entity.Id, entity.UserName!);
    }
}
