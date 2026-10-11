using Barberly.API.Domain.Models;
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
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Agendamento>().ToTable("agendamento");
            modelBuilder.Entity<Avaliacao>().ToTable("avaliacao");
            modelBuilder.Entity<Barbearia>().ToTable("barbearia");
            modelBuilder.Entity<Barbeiro>().ToTable("barbeiro");
            modelBuilder.Entity<CategoriaServico>().ToTable("categoriaservico");
            modelBuilder.Entity<DonoBarbearia>().ToTable("donobarbearia");
            modelBuilder.Entity<HorarioFuncionamento>().ToTable("horariofuncionamento");
            modelBuilder.Entity<Servico>().ToTable("servico");
            modelBuilder.Entity<Usuario>().ToTable("usuario");

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<DonoBarbearia>()
                .HasIndex(d => d.Email)
                .IsUnique();

            // Barbearia -> Serviços
            modelBuilder.Entity<Servico>()
                .HasOne(s => s.Barbearia)
                .WithMany()
                .HasForeignKey(s => s.IdBarbearia)
                .OnDelete(DeleteBehavior.Cascade);

            // CategoriaServico -> Serviços
            modelBuilder.Entity<Servico>()
                .HasOne(s => s.Categoria)
                .WithMany()
                .HasForeignKey(s => s.IdCategoria)
                .OnDelete(DeleteBehavior.Cascade);

            // Usuario -> Agendamentos
            modelBuilder.Entity<Agendamento>()
                .HasOne(a => a.Usuario)
                .WithMany()
                .HasForeignKey(a => a.IdUsuario)
                .OnDelete(DeleteBehavior.Cascade);

            // Servico -> Agendamentos
            modelBuilder.Entity<Agendamento>()
                .HasOne(a => a.Servico)
                .WithMany()
                .HasForeignKey(a => a.IdServico)
                .OnDelete(DeleteBehavior.Cascade);


            // Usuario -> Avaliacoes
            modelBuilder.Entity<Avaliacao>()
                .HasOne(a => a.Usuario)
                .WithMany()
                .HasForeignKey(a => a.IdUsuario)
                .OnDelete(DeleteBehavior.Cascade);

            // Agendamento -> Avaliacoes
            modelBuilder.Entity<Avaliacao>()
                .HasOne(a => a.Agendamento)
                .WithMany()
                .HasForeignKey(a => a.IdAgendamento)
                .OnDelete(DeleteBehavior.Cascade);


            // Barbearia -> HorariosFuncionamento
            modelBuilder.Entity<HorarioFuncionamento>()
                .HasOne(h => h.Barbearia)
                .WithMany()
                .HasForeignKey(h => h.IdBarbearia)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Barbeiro>()
                .HasOne(b => b.Barbearia)
                .WithMany()
                .HasForeignKey(b => b.IdBarbearia)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}