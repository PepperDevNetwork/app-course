package jp.co.happyhack.accountmanagertest;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

public class TestAccountTypeService extends Service {
    public TestAccountTypeService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }
}
