using Microsoft.AspNetCore.SignalR;

namespace SmartRent.API.Hubs
{
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            // TODO: implement — add user to their personal group
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // TODO: implement — remove user from their personal group
            await base.OnDisconnectedAsync(exception);
        }
    }
}
