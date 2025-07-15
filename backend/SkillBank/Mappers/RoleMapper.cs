using SkillBank.Entities;
using SkillBank.Models;

namespace SkillBank.Mappers;

public class RoleMapper
{
    public static UserRole FromDto(RoleDto roleDto) => roleDto switch
    {
        RoleDto.Admin => UserRole.Admin,
        RoleDto.Consultant => UserRole.Consultant,
        RoleDto.Sales => UserRole.Sales,
        _ => UserRole.Consultant,
    };

    public static RoleDto ToDto(UserRole userRole) => userRole switch
    {
        UserRole.Admin => RoleDto.Admin,
        UserRole.Consultant => RoleDto.Consultant,
        UserRole.Sales => RoleDto.Sales,
        _ => RoleDto.Consultant,
    };
}
