using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using SkillBank;
using SkillBank.Entities;
using SkillBank.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.IncludeXmlComments(Assembly.GetExecutingAssembly());
});

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var authConfig = builder.Configuration.GetSection("Authorization");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = authConfig.GetValue<string>("Issuer"),
            ValidateAudience = true,
            ValidAudience = authConfig.GetValue<string>("Audience"),
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authConfig.GetValue<string>("Token")!)),
        };
    });
builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddApiEndpoints();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options
        .UseNpgsql(builder.Configuration.GetConnectionString("Database"))
        .UseAsyncSeeding(async (context, _, cancellationToken) =>
        {
            // Development data omitted in async version.
            if (builder.Environment.IsProduction())
            {
                var seeder = new DataSeeder(context, context.GetService<IPasswordHasher<User>>());
                var adminPassword = builder.Configuration.GetValue<string>("AdminPassword")!;
                await seeder.SeedAdminAsync(adminPassword, cancellationToken);
            }
        })
        .UseSeeding((context, _) =>
        {
            var seeder = new DataSeeder(context, context.GetService<IPasswordHasher<User>>());
            if (builder.Environment.IsProduction() || builder.Environment.IsDevelopment())
            {
                var adminPassword = builder.Configuration.GetValue<string>("AdminPassword")!;
                seeder.SeedAdmin(adminPassword);
            }
            if (builder.Environment.IsDevelopment())
            {
                var seedJson = Path.Combine(AppContext.BaseDirectory, "seed.json");
                seeder.SeedData(seedJson);
            }
        })
    );

builder.Services.AddControllers();
builder.Services.AddExceptionHandler<ExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<SkillService>();
builder.Services.AddScoped<UserService>();

SetupEnumSerialization(builder);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.UseExceptionHandler();
app.UseHttpsRedirection();

app.Run();

static void SetupEnumSerialization(WebApplicationBuilder builder)
{
    var enumConverter = new JsonStringEnumConverter();
    builder.Services.ConfigureHttpJsonOptions(options =>
    {
        options.SerializerOptions.Converters.Add(enumConverter);
    });
    builder.Services.Configure<Microsoft.AspNetCore.Mvc.JsonOptions>(options =>
    {
        options.JsonSerializerOptions.Converters.Add(enumConverter);
    });
}

// Workaround to make class visible for integration tests
// https://stackoverflow.com/a/69483450
public partial class Program
{
}
