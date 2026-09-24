using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarbeiroController : ControllerBase
    {
        private readonly DataContext _context;
        public BarbeiroController (DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Barbeiro>> Get()
        {
            return new List<Barbeiro>();
        }

        [HttpGet("{id}")]
        public ActionResult<Barbeiro> Get(int id)
        {
            return new Barbeiro();
        }

        [HttpPost]
        public ActionResult<Barbeiro> Post(Barbeiro barbeiro)
        {
            return new Barbeiro();
        }

        [HttpPut("{id}")]
        public ActionResult<Barbeiro> Put(int id, Barbeiro barbeiro)
        {
            return new Barbeiro();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
