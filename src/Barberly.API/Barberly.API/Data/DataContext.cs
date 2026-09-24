using Barberly.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Agendamento> Agendamentos { get; set; }
        public DbSet<Avaliacao> Avaliacoes { get; set; }
        public DbSet<Barbearia> Barbearias { get; set; }
        public DbSet<Barbeiro> Barbeiros { get; set; }
        public DbSet<CategoriaServico> CategoriaServicos { get; set; }
        public DbSet<DonoBarbearia> DonoBarbearias { get; set; }
        public DbSet<HorarioFuncionamento> HorarioFuncionamentos { get; set; }
        public DbSet<Servico> Servicos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Agendamento>().ToTable("agendamento");
            modelBuilder.Entity<Avaliacao>().ToTable("avaliacao");
            modelBuilder.Entity<Barbearia>().ToTable("barbearia");
            modelBuilder.Entity<Barbeiro>().ToTable("barbeiro");
            modelBuilder.Entity<CategoriaServico>().ToTable("categoriaservico");
            modelBuilder.Entity<DonoBarbearia>().ToTable("donobarbearia");
            modelBuilder.Entity<HorarioFuncionamento>().ToTable("horariofuncionamento");
            modelBuilder.Entity<Servico>().ToTable("servico");
            modelBuilder.Entity<Usuario>().ToTable("usuario");
        }
    }
}
