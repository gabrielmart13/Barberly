namespace Barberly.API.Domain.DTOs.AvaliacaoDTO
{
    public class CriarAvaliacaoRequest
    {
        public int Nota { get; set; }
        public string Comentario { get; set; } = string.Empty;
        public int IdUsuario { get; set; }
        public int IdAgendamento { get; set; }
    }
}
