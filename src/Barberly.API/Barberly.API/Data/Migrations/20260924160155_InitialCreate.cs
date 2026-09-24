using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace Barberly.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "categoriaservico",
                columns: table => new
                {
                    IdCategoria = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Descricao = table.Column<string>(type: "longtext", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categoriaservico", x => x.IdCategoria);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "donobarbearia",
                columns: table => new
                {
                    IdDonoBarbearia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: false),
                    Senha = table.Column<string>(type: "longtext", nullable: false),
                    Contato = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_donobarbearia", x => x.IdDonoBarbearia);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "usuario",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: false),
                    Senha = table.Column<string>(type: "longtext", nullable: false),
                    Contato = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuario", x => x.IdUsuario);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "barbearia",
                columns: table => new
                {
                    IdBarbearia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Endereco = table.Column<string>(type: "longtext", nullable: false),
                    Contato = table.Column<string>(type: "longtext", nullable: false),
                    Descricao = table.Column<string>(type: "longtext", nullable: true),
                    IdDonoBarbearia = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_barbearia", x => x.IdBarbearia);
                    table.ForeignKey(
                        name: "FK_barbearia_donobarbearia_IdDonoBarbearia",
                        column: x => x.IdDonoBarbearia,
                        principalTable: "donobarbearia",
                        principalColumn: "IdDonoBarbearia",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "barbeiro",
                columns: table => new
                {
                    IdBarbeiro = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: false),
                    Contato = table.Column<string>(type: "longtext", nullable: false),
                    Experiencia = table.Column<string>(type: "longtext", nullable: true),
                    IdBarbearia = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_barbeiro", x => x.IdBarbeiro);
                    table.ForeignKey(
                        name: "FK_barbeiro_barbearia_IdBarbearia",
                        column: x => x.IdBarbearia,
                        principalTable: "barbearia",
                        principalColumn: "IdBarbearia",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "horariofuncionamento",
                columns: table => new
                {
                    IdHorario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    DiaSemana = table.Column<string>(type: "longtext", nullable: false),
                    HoraAbertura = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    HoraFechamento = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                    IdBarbearia = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_horariofuncionamento", x => x.IdHorario);
                    table.ForeignKey(
                        name: "FK_horariofuncionamento_barbearia_IdBarbearia",
                        column: x => x.IdBarbearia,
                        principalTable: "barbearia",
                        principalColumn: "IdBarbearia",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "servico",
                columns: table => new
                {
                    IdServico = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nome = table.Column<string>(type: "longtext", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TempoEstimado = table.Column<int>(type: "int", nullable: false),
                    IdCategoria = table.Column<int>(type: "int", nullable: false),
                    IdBarbearia = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_servico", x => x.IdServico);
                    table.ForeignKey(
                        name: "FK_servico_barbearia_IdBarbearia",
                        column: x => x.IdBarbearia,
                        principalTable: "barbearia",
                        principalColumn: "IdBarbearia",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_servico_categoriaservico_IdCategoria",
                        column: x => x.IdCategoria,
                        principalTable: "categoriaservico",
                        principalColumn: "IdCategoria",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "agendamento",
                columns: table => new
                {
                    IdAgendamento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    DataHora = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    IdServico = table.Column<int>(type: "int", nullable: false),
                    IdBarbeiro = table.Column<int>(type: "int", nullable: false),
                    IdBarbearia = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agendamento", x => x.IdAgendamento);
                    table.ForeignKey(
                        name: "FK_agendamento_barbearia_IdBarbearia",
                        column: x => x.IdBarbearia,
                        principalTable: "barbearia",
                        principalColumn: "IdBarbearia",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_agendamento_barbeiro_IdBarbeiro",
                        column: x => x.IdBarbeiro,
                        principalTable: "barbeiro",
                        principalColumn: "IdBarbeiro",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_agendamento_servico_IdServico",
                        column: x => x.IdServico,
                        principalTable: "servico",
                        principalColumn: "IdServico",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_agendamento_usuario_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "usuario",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "avaliacao",
                columns: table => new
                {
                    IdAvaliacao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Nota = table.Column<int>(type: "int", nullable: false),
                    Comentario = table.Column<string>(type: "longtext", nullable: true),
                    DataAvaliacao = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    IdAgendamento = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_avaliacao", x => x.IdAvaliacao);
                    table.ForeignKey(
                        name: "FK_avaliacao_agendamento_IdAgendamento",
                        column: x => x.IdAgendamento,
                        principalTable: "agendamento",
                        principalColumn: "IdAgendamento",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_avaliacao_usuario_IdUsuario",
                        column: x => x.IdUsuario,
                        principalTable: "usuario",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_agendamento_IdBarbearia",
                table: "agendamento",
                column: "IdBarbearia");

            migrationBuilder.CreateIndex(
                name: "IX_agendamento_IdBarbeiro",
                table: "agendamento",
                column: "IdBarbeiro");

            migrationBuilder.CreateIndex(
                name: "IX_agendamento_IdServico",
                table: "agendamento",
                column: "IdServico");

            migrationBuilder.CreateIndex(
                name: "IX_agendamento_IdUsuario",
                table: "agendamento",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_avaliacao_IdAgendamento",
                table: "avaliacao",
                column: "IdAgendamento");

            migrationBuilder.CreateIndex(
                name: "IX_avaliacao_IdUsuario",
                table: "avaliacao",
                column: "IdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_barbearia_IdDonoBarbearia",
                table: "barbearia",
                column: "IdDonoBarbearia");

            migrationBuilder.CreateIndex(
                name: "IX_barbeiro_IdBarbearia",
                table: "barbeiro",
                column: "IdBarbearia");

            migrationBuilder.CreateIndex(
                name: "IX_horariofuncionamento_IdBarbearia",
                table: "horariofuncionamento",
                column: "IdBarbearia");

            migrationBuilder.CreateIndex(
                name: "IX_servico_IdBarbearia",
                table: "servico",
                column: "IdBarbearia");

            migrationBuilder.CreateIndex(
                name: "IX_servico_IdCategoria",
                table: "servico",
                column: "IdCategoria");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "avaliacao");

            migrationBuilder.DropTable(
                name: "horariofuncionamento");

            migrationBuilder.DropTable(
                name: "agendamento");

            migrationBuilder.DropTable(
                name: "barbeiro");

            migrationBuilder.DropTable(
                name: "servico");

            migrationBuilder.DropTable(
                name: "usuario");

            migrationBuilder.DropTable(
                name: "barbearia");

            migrationBuilder.DropTable(
                name: "categoriaservico");

            migrationBuilder.DropTable(
                name: "donobarbearia");
        }
    }
}
