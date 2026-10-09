namespace Barberly.API.Domain.DTOs.HorarioFuncionamentoDTO
{
    public class CriarHorarioRequest
    {
        public string DiaSemana { get; set; } = string.Empty;
        public TimeSpan HoraAbertura { get; set; }
        public TimeSpan HoraFechamento { get; set; }
        public int IdBarbearia { get; set; }
    }
}
