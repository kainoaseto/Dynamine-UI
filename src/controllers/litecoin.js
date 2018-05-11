/* global app:true Chart:true */
(function (angular, app, Chart) { 'use strict';
    const controller = 'LitecoinController';
    if (typeof app === 'undefined') throw (controller + ': app is undefined');

    Chart.defaults.global.defaultFontColor = '#9db4be';
    Chart.defaults.global.defaultFontStyle = 'bold';

    let createChart = function (container, data) {
        if (typeof data.options === 'undefined') data.options = {responsive: true, scales: {xAxes: [{ticks: {beginAtZero: true}}]}};

        return new Chart (angular.element(container)[0].getContext('2d'), data);
    };

    app.controller(controller, ['$scope', 'ajax', 'toast', 'viewFactory', 'dynamineConfig', 'callliteWallet', 'daemon', 'coinMetrics', function ($scope, ajax, toast, viewFactory, dynamineConfig, callliteWallet, daemon, coinMetrics) {
        viewFactory.title = 'Litecoin';
        viewFactory.prevUrl = null;
        let config = dynamineConfig.getConfig();
        var walletAddress;
        var walbal;
        var walnumtrans;
        var payments;
        var coinchart;

        walletAddress = callliteWallet.callconfig(dynamineConfig);
        walbal = callliteWallet.callwalletbal(walletAddress);
        walnumtrans = callliteWallet.callwalletnumtrans(walletAddress);
        payments = callliteWallet.callwallettrans(walletAddress);
        console.log("Transactions: ");
        console.log(payments);

        $scope.getWalletBalance = function() {
            walbal = '' + walbal;
            return walbal;
        }

         $scope.getWalletNumTrans = function() {
             walnumtrans = '' + walnumtrans;
             return walnumtrans;
         }


        $scope.getWalletPayment1 = function() {
            console.log("Transaction type: " + typeof(payments));
            console.log(payments);
            return payments[0];
        }

        $scope.getWalletPayment2 = function() {
            return payments[1];
        }

        $scope.getWalletPayment3 = function() {
            return payments[2];
        }

        $scope.getWalletPayment4 = function() {
            return payments[3];
        }

        $scope.getWalletPayment5 = function() {
            return payments[4];
        }

        viewFactory.prevUrl = null
        let coinName = "litecoin";

        $scope.resources = dynamineConfig.getResources();

        $scope.allocateResource = function(resource) {
          if( document.getElementById(resource.name).checked) {
            if(resource.coin && resource.coin != coinName) {
              daemon.stopCoin(resource.name);
            }
            dynamineConfig.allocateResource(true, resource.name, coinName);
            daemon.startCoin(resource.name, dynamineConfig.getInfoForCoin(coinName).algorithm,  dynamineConfig.getInfoForCoin(coinName).walletAddress, dynamineConfig.getInfoForCoin(coinName).poolServer, dynamineConfig.getInfoForCoin(coinName).poolPassword);
            $scope.resources = dynamineConfig.getResources();
          } else {
            dynamineConfig.allocateResource(false, resource.name, "");
            daemon.stopCoin(resource.name);
            $scope.resources = dynamineConfig.getResources();
          }
        }

        $scope.resourceChecked = function(resource) {
          return (resource.allocated && resource.coin == coinName);
        }

        $scope.getPoolHost = function() {
          return dynamineConfig.getInfoForCoin(coinName).poolServer;
        }

        $scope.getWalletAddress = function() {
          return dynamineConfig.getInfoForCoin(coinName).walletAddress;
        }

        $scope.getDaemonHost = function() {
          return dynamineConfig.getConfig().daemonHost;
        }

        $scope.refreshWalletTokens = function(master) {
          coinchart = createChart('#LitecoinWalletChart', {
              type: 'line',
              data: { labels: [], datasets: [{
                  data: [ payments[0], payments[1], payments[2], payments[3], payments[4], payments[5], payments[6], payments[7], payments[8], payments[9], payments[10], payments[11], payments[12], payments[13], payments[14], payments[15], payments[16], payments[17], payments[18], payments[19], payments[20], payments[21], payments[22], payments[23]],
                  label: 'coins',
                  backgroundColor: ['rgba(24, 138, 226, 0.5)', 'rgba(16, 196, 105, 0.5)', 'rgba(128, 197, 218, 0.5)',
                      'rgba(248, 142, 15, 0.5)', 'rgba(207, 32, 241, 0.5)', 'rgba(91, 105, 188, 0.5)', 'rgba(24, 138, 226, 0.5)']
                  //backgroundColor:['#10C469', '#FFCE56']
              }]}
          });

          setInterval(function(){
            var payments = callliteWallet.callwallettrans(walletAddress);
            coinchart.update(payments);
            }, 100000);

          if(!master || master !== true)
              toast.success('Timers data has been updated');
        };

        $scope.refreshHashRate = function(master) {
          //Populating chart with static data for the sake of wireframes
          createChart('#LitecoinHashChart', {
              type: 'line',
              data: { labels: [], datasets: [{
                  data: coinMetrics.getMetricsByName(coinName, 'hashRate'),
                  backgroundColor: ['rgba(24, 138, 226, 0.5)', 'rgba(16, 196, 105, 0.5)', 'rgba(128, 197, 218, 0.5)',
                      'rgba(248, 142, 15, 0.5)', 'rgba(207, 32, 241, 0.5)', 'rgba(91, 105, 188, 0.5)', 'rgba(24, 138, 226, 0.5)'],
                  borderColor: ['#188AE2', '#10C469', '#80C5DA', '#F88E0F', '#CF20F1', '#5B69BC', '#188AE2'],
                  borderWidth: 1, label: 'net hash rate'
              }] }
          });
        };

        $scope.$on(coinName+'HashRate', function(event, data) {
          $scope.refreshHashRate(); // refreshing hashrate when receive a new metric
        });

        $scope.refreshHashRate(true);
        $scope.refreshWalletTokens(true);

    }]);
})(window.angular, app, Chart);
