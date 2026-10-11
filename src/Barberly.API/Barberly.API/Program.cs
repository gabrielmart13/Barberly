using Barberly.API.Data;
using Barberly.API.Data.Repositories;
using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Middleware;
using Barberly.API.Services;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers e Swagger.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();


//Configurando o swagger com authorize
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http, //Utilizamos autenticacao http
        Scheme = "bearer", //Autenticacao do tipo bearer
        BearerFormat = "JWT", //Token e no formato JWT
        In = ParameterLocation.Header,
        Description = "Informe seu token JWT."
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});



// Conexão com o MySQL.
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("Default")
        ?? throw new InvalidOperationException(
            "Connection string 'Default' não configurada."
        )
    )
);

// Registra o repositório geral.
builder.Services.AddScoped<IGeralRepo, GeralRepo>();

// Registra os services de autenticação.
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<JwtService>();

// Registra os services das entidades.
builder.Services.AddScoped<IAgendamentoService, AgendamentoService>();
builder.Services.AddScoped<IAvaliacaoService, AvaliacaoService>();
builder.Services.AddScoped<IBarbeariaService, BarbeariaService>();
builder.Services.AddScoped<IBarbeiroService, BarbeiroService>();
builder.Services.AddScoped<ICategoriaServicoService, CategoriaServicoService>();
builder.Services.AddScoped<IHorarioFuncionamentoService, HorarioFuncionamentoService>();
builder.Services.AddScoped<IServicoService, ServicoService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();

// Lê a chave usada para assinar e validar os JWTs.
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "A chave JWT não foi configurada."
    );

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "O issuer JWT não foi configurado."
    );

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "A audience JWT não foi configurada."
    );

// HS256 exige uma chave suficientemente forte.
// Usamos pelo menos 32 bytes para este projeto.
if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException(
        "A chave JWT deve ter pelo menos 32 bytes."
    );
}

// Configura a autenticação por Bearer token.
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            ),

            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,

            ValidateAudience = true,
            ValidAudience = jwtAudience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),

            NameClaimType = ClaimTypes.Name,
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionMiddleware>();

// A autenticação precisa ocorrer antes da autorização.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();