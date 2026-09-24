using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgendamentoController : ControllerBase
    {
        private readonly DataContext _context;
        public AgendamentoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult <List<Agendamento>> Get()
        {
            return new List<Agendamento>();
        }

        [HttpGet("{id}")]
        public ActionResult <Agendamento> Get(int id)
        {
            return new Agendamento();
        }

        [HttpPost]
        public ActionResult <Agendamento> Post(Agendamento agendamento)
        {
            return new Agendamento();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent ();
        }
    }
}
